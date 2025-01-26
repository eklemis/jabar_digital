import pytest
import os
from src.main import get_product_usecase
from src.applications.use_cases.fetch_products_usecase import FetchProductsUseCase
from src.infrastructures.product_repository import ProductRepository
from src.infrastructures.exchange_rate_repository import ExchangeRateRepository
from src.domains.product import Product
from src.domains.exchange_rate import ExchangeRate
from unittest.mock import AsyncMock

@pytest.mark.asyncio
async def test_get_product_usecase(mocker):
    # Provide mock values for required arguments
    api_url = "http://mocked.api/exchange"
    api_key = "mocked-api-key"

    # Mock dependencies
    mock_product_repo = mocker.AsyncMock()
    mock_exchange_repo = mocker.AsyncMock()

    # Mock the fetch_exchange_rate method's return value
    mock_exchange_repo.fetch_exchange_rate = AsyncMock(
        return_value=ExchangeRate(currency="IDR", value=16151.74)
    )

    # Inject mocks into use case
    use_case = FetchProductsUseCase(mock_product_repo, mock_exchange_repo)

    # Ensure use case instance is created
    assert use_case is not None

    # Call the execute function (assuming it uses the exchange repo)
    await use_case.execute()

    # Validate the exchange rate fetch method was called
    mock_exchange_repo.fetch_exchange_rate.assert_called_once()
