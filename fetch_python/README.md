# Product API Documentation

## Introduction
The **Product API** is a web-based service built with **FastAPI**, designed to fetch and process product data with currency conversion. It follows the principles of **Clean Architecture**, ensuring flexibility and ease of adaptation to changes. The project also adopts **Test-Driven Development (TDD)**, guaranteeing well-tested, high-quality code. API documentation is provided using **Swagger**, enabling interactive exploration of API endpoints via OpenAPI specifications.

## Project Structure
```
.
├── README.md
├── doc.md
├── requirement.md
├── requirements.txt
└── src
    ├── __init__.py
    ├── applications
    │   ├── __init__.py
    │   └── use_cases
    │       ├── __init__.py
    │       ├── _test
    │       │   └── test_fetch_products_usecase.py
    │       └── fetch_products_usecase.py
    ├── domains
    │   ├── __init__.py
    │   ├── exchange_rate.py
    │   ├── product.py
    │   └── user.py
    ├── infrastructures
    │   ├── __init__.py
    │   ├── _test
    │   │   ├── test_exchange_rate_repository.py
    │   │   └── test_product_repository.py
    │   ├── exchange_rate_repository.py
    │   └── product_repository.py
    ├── interfaces
    │   ├── __init__.py
    │   ├── _test
    │   │   ├── test_aggregated_api.py
    │   │   ├── test_api.py
    │   │   └── test_exchange_rate_repository_interface.py
    │   ├── exchange_rate_repository_interface.py
    │   └── product_repository_interface.py
    └── main.py
```

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/fetch_python.git
   cd fetch_python
   ```
2. Create and activate a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

## Configuration

Set up the `.env` file in the root directory with the following variables:
```
PRODUCT_API_URL=https://60c18de74f7e880017dbfd51.mockapi.io/api/v1/jabar-digital-services/product
CONVERTER_API=https://api.currencyapi.com/v3/latest?base_currency=USD&currencies=IDR
CONVERTER_API_KEY=your_converter_api_key
ACCESS_TOKEN_KEY=same_access_token_key_from_auth_node_api
```

## Running the Application

Start the FastAPI server:
```sh
uvicorn src.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## API Documentation

FastAPI provides an interactive API documentation using **Swagger**.
- Open the documentation at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## Authentication

The API requires JWT authentication for protected routes. Provide the token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```
### Generating a JWT Token

You can generate a JWT token using the `auth_node` API or via a Python script:
```python
import jwt
from datetime import datetime, timedelta

ACCESS_TOKEN_KEY = "same_access_token_key_from_auth_node_api"
payload = {
    "sub": "user123",
    "exp": datetime.utcnow() + timedelta(hours=1),
    "iat": datetime.utcnow(),
    "role": "admin"
}
token = jwt.encode(payload, ACCESS_TOKEN_KEY, algorithm="HS256")
print(token)
```

## Endpoints

### `GET /products`
Fetches a list of products with prices converted to IDR.

#### Request Headers
```
Authorization: Bearer <your_jwt_token>
```

#### Response Example
```json
{
    "status": "success",
    "data": [
        {
            "product": "Bike",
            "price": 1500000.0,
            "department": "Sports"
        }
    ]
}
```

### `GET /aggregated-products`
Fetches aggregated products, grouped by department and product, sorted by price in ascending order.

#### Request Headers
```
Authorization: Bearer <your_jwt_token>
```

#### Response Example
```json
{
    "status": "success",
    "data": [
        {"department": "Sports", "product": "Bike", "price": 4500000.00},
        {"department": "Toys", "product": "Car", "price": 3000000.00}
    ]
}
```

## Running Tests
Before running tests, ensure you set the correct environment variable:
```sh
export PYTHONPATH=$(pwd)
```
Then run the unit and intergration tests using pytest:
```sh
pytest --cov=src --cov-report=term-missing
```

## Docker Deployment

### Building and Running the Application with Docker

1. Build the Docker image:
   ```sh
   docker build -t product_api .
   ```
2. Run the Docker container:
   ```sh
   docker run -p 8000:8000 --env-file .env product_api
   ```

### Using Docker Compose

1. Start the services:
   ```sh
   docker-compose up --build
   ```
2. Stop the services:
   ```sh
   docker-compose down
   ```

### Docker Compose Configuration
```
version: "3.8"

services:
  product_api:
    build: .
    container_name: product_api
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - .:/app
    restart: always
    command: uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```
Here's the updated guideline section to include Postman test instructions:

---

## Testing the API with Postman

To test the **Product API** using Postman, follow these steps:

1. **Pre-requisites:**
   - Ensure that the **auth_node** API is running and accessible.
   - Run the Postman test collection for the **auth_node** first to generate a valid JWT token.

2. **Steps to Run Tests:**
   - Open **Postman** and navigate to the `postman` folder in your project directory.
   - Import the collection named **`Protected Products.postman_collection.json`**.
   - Set the `Authorization` header in Postman using the token obtained from the **auth_node** API.
   - Run the collection to test the secured endpoints of the Product API.

3. **Expected Responses:**
   - Ensure that the API responds with `200 OK` for valid requests.
   - For unauthorized requests (invalid or missing JWT), expect `401 Unauthorized` responses.

4. **Postman Collection Overview:**
   - The collection includes tests for:
     - **GET /products** – Retrieve product data with currency conversion.
     - **GET /aggregated-products** – Get aggregated product information, accessible only to admin users.

---
