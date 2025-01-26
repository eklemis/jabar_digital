from fastapi import FastAPI, Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer
from typing import Dict, Any
from dotenv import load_dotenv
import os
import jwt
from collections import defaultdict
from pydantic import BaseModel

from src.applications.use_cases.fetch_products_usecase import FetchProductsUseCase
from src.infrastructures.product_repository import ProductRepository
from src.infrastructures.exchange_rate_repository import ExchangeRateRepository
from src.domains.user import User

# Load environment variables from .env file
load_dotenv()

# load environment variables
PRODUCT_API_URL = os.getenv("PRODUCT_API_URL")
CONVERTER_API_URL = os.getenv("CONVERTER_API")
CONVERTER_API_KEY = os.getenv("CONVERTER_API_KEY")
ACCESS_TOKEN_KEY = os.getenv("ACCESS_TOKEN_KEY")
print(ACCESS_TOKEN_KEY)
app = FastAPI()
security = HTTPBearer()

# Function to verify JWT
def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        decoded_token = jwt.decode(token, ACCESS_TOKEN_KEY, algorithms=["HS256"])
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        decoded_token = jwt.decode(token, ACCESS_TOKEN_KEY, algorithms=["HS256"])

        # Check if the role is admin
        if decoded_token.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Forbidden: Insufficient permissions")

        return User(**decoded_token)

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Dependency Injection function to pass the use case with the configured API URL
def get_product_usecase():
    return FetchProductsUseCase(ProductRepository(PRODUCT_API_URL), ExchangeRateRepository(CONVERTER_API_URL, CONVERTER_API_KEY))

@app.get("/products")
async def get_products(usecase: FetchProductsUseCase = Depends(get_product_usecase), token: dict = Depends(verify_token)):

    products = await usecase.execute()
    return {"status": "success", "data": products}


@app.get("/aggregated-products")
async def get_aggregated_products(user: User = Depends(get_current_user), usecase: FetchProductsUseCase = Depends(get_product_usecase), token: dict = Depends(verify_token)):
    products = await usecase.execute()

    # Aggregation logic: Summing product prices within the same department and product
    aggregated_data = defaultdict(float)
    for product in products:
        key = (product.department, product.product)
        aggregated_data[key] += product.price

    # Convert aggregated data back to list of dictionaries
    aggregated_products = [
        {"department": dept, "product": prod, "price": price}
        for (dept, prod), price in aggregated_data.items()
    ]

    # Sorting by price in ascending order
    sorted_products = sorted(aggregated_products, key=lambda x: x["price"])

    return {"status": "success", "data": sorted_products}

# Define response model
class PrivateClaimsResponse(BaseModel):
    status: str
    data: Dict[str, Any]

@app.get("/users/private/claims", response_model=PrivateClaimsResponse)
async def get_private_claims(token: dict = Depends(verify_token)):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {"status":"success","data":{
        "id": token.get("id"),
        "nik": token.get("nik"),
        "role": token.get("role"),
    }}
