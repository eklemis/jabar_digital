from abc import ABC, abstractmethod
from typing import List
from src.domains.product import Product

class ProductRepositoryInterface(ABC):
    @abstractmethod
    async def fetch_products(self) -> List[Product]:
        pass
