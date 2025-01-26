from pydantic import BaseModel
from datetime import datetime

class Product(BaseModel):
    id: str
    createdAt: datetime
    price: float
    department: str
    product: str
