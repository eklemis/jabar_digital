from src.interfaces.product_repository_interface import ProductRepositoryInterface
from src.interfaces.exchange_rate_repository_interface import ExchangeRateRepositoryInterface

class FetchProductsUseCase:
    def __init__(self, product_repository: ProductRepositoryInterface, exchange_rate_repository: ExchangeRateRepositoryInterface):
        self._product_repository = product_repository
        self._exchange_rate_repository = exchange_rate_repository

    async def execute(self):
        products = await self._product_repository.fetch_products()
        exchange_rate = await self._exchange_rate_repository.fetch_exchange_rate()

        for product in products:
            product.price = round(product.price * exchange_rate.value, 2)

        return products
