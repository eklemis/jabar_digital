import httpx
from typing import List
from src.domains.product import Product
from src.interfaces.product_repository_interface import ProductRepositoryInterface

class ProductRepository(ProductRepositoryInterface):
    def __init__(self, api_url: str):
        self.api_url = api_url

    async def fetch_products(self) -> List[Product]:
        async with httpx.AsyncClient() as client:
            response = await client.get(self.api_url)
            response.raise_for_status()
            data = response.json()
            return [Product(**item) for item in data]
