import pytest
from httpx import Response, HTTPStatusError
from src.infrastructures.product_repository import ProductRepository
from unittest.mock import AsyncMock, Mock, patch

@pytest.mark.asyncio
async def test_get_products_success():
    mock_response_data = [
        {
            "id": "1",
            "createdAt": "2021-06-09T09:37:05.527Z",
            "price": "100.00",
            "department": "Sports",
            "product": "Bike"
        }
    ]

    # Mocking the httpx.AsyncClient.get method
    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        # Create a mock response object
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = mock_response_data

        # Set the return value of the mocked get method
        mock_get.return_value = mock_response

        repo = ProductRepository("http://fakeapi.com")
        products = await repo.fetch_products()

        # Assertions
        assert len(products) == 1
        assert products[0].product == "Bike"
        assert products[0].price == 100.00
        assert products[0].department == "Sports"

        # Ensure the mocked get method was called once with the correct URL
        mock_get.assert_called_once_with("http://fakeapi.com")

@pytest.mark.asyncio
async def test_get_products_api_failure():
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

        repo = ProductRepository("http://mocked.api/products")

        with pytest.raises(HTTPStatusError):
            await repo.fetch_products()
