import pytest
from httpx import HTTPStatusError
from unittest.mock import AsyncMock, Mock, patch
from src.infrastructures.exchange_rate_repository import ExchangeRateRepository
from src.domains.exchange_rate import ExchangeRate

@pytest.mark.asyncio
async def test_fetch_exchange_rate_success():
    mock_response_data = {
        "meta": {"last_updated_at": "2025-01-24T23:59:59Z"},
        "data": {"IDR": {"code": "IDR", "value": 16151.747203983}}
    }

    # Mocking the httpx.AsyncClient.get method
    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        # Create a mock response object
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = mock_response_data

        # Set the return value of the mocked get method
        mock_get.return_value = mock_response

        repo = ExchangeRateRepository("http://mocked.api/exchange_rate", "dummy_api_key")
        exchange_rate = await repo.fetch_exchange_rate()

        # Assertions
        assert exchange_rate.currency == "IDR"
        assert exchange_rate.value == 16151.747203983

        # Ensure the mocked get method was called once with the correct URL and headers
        mock_get.assert_called_once_with(
            "http://mocked.api/exchange_rate",
            headers={"apikey": "dummy_api_key"}
        )

@pytest.mark.asyncio
async def test_fetch_exchange_rate_api_failure():
    # Mocking httpx.AsyncClient.get method to return a 500 response
    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        # Create a mock response object with 500 status code
        mock_response = Mock()
        mock_response.status_code = 500
        mock_response.raise_for_status.side_effect = HTTPStatusError(
            "Internal Server Error",
            request=Mock(),
            response=Mock(status_code=500),
        )

        # Set the return value of the mocked get method
        mock_get.return_value = mock_response

        repo = ExchangeRateRepository("http://mocked.api/exchange_rate", "dummy_api_key")

        with pytest.raises(HTTPStatusError):
            await repo.fetch_exchange_rate()
