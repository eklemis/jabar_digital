from abc import ABC, abstractmethod
from src.domains.exchange_rate import ExchangeRate

class ExchangeRateRepositoryInterface(ABC):
    @abstractmethod
    async def fetch_exchange_rate(self) -> ExchangeRate:
        pass
