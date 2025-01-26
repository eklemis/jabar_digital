import httpx
import os
from src.domains.exchange_rate import ExchangeRate
from src.interfaces.exchange_rate_repository_interface import ExchangeRateRepositoryInterface

class ExchangeRateRepository(ExchangeRateRepositoryInterface):
    def __init__(self, api_url: str, api_key: str):
        self.api_url = api_url
        self.api_key = api_key

    async def fetch_exchange_rate(self) -> ExchangeRate:
        async with httpx.AsyncClient() as client:
            response = await client.get(self.api_url, headers={"apikey": self.api_key})
            response.raise_for_status()
            data = response.json()
            exchange_rate = data["data"]["IDR"]["value"]
            return ExchangeRate(currency="IDR", value=exchange_rate)
