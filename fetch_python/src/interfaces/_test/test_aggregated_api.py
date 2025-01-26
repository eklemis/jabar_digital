import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.domains.product import Product
from unittest.mock import AsyncMock, patch
from src.domains.exchange_rate import ExchangeRate

client = TestClient(app)

@pytest.mark.asyncio
async def test_get_aggregated_products(mocker):
    # Mock dependencies
    mock_product_repo = mocker.patch("src.main.ProductRepository", return_value=AsyncMock())
    mock_exchange_repo = mocker.patch("src.main.ExchangeRateRepository", return_value=AsyncMock())

    # Mock product data
    mock_product_repo.return_value.fetch_products.return_value = [
            Product(id="1", createdAt="2021-06-09T09:37:05.527Z", price=100.00, department="Sports", product="Bike"),
            Product(id="2", createdAt="2021-06-09T10:00:00.000Z", price=200.00, department="Sports", product="Bike"),
            Product(id="3", createdAt="2021-06-09T11:00:00.000Z", price=150.00, department="Toys", product="Car"),
            Product(id="4", createdAt="2021-06-09T12:00:00.000Z", price=50.00, department="Toys", product="Car"),
    ]
    mock_exchange_repo.return_value.fetch_exchange_rate.return_value = ExchangeRate(currency="IDR", value=15000.0)

    # Call the endpoint
    response = client.get("/aggregated-products")

    # Assertions
    assert response.status_code == 200
    assert response.json() == {
            "status": "success",
            "data": [
                {"department": "Toys", "product": "Car", "price": 3000000.00},  # (150 + 50) * 15000
                {"department": "Sports", "product": "Bike", "price": 4500000.00}  # (100 + 200) * 15000
            ]
    }

    # Ensure the mock methods were called
    mock_product_repo.return_value.fetch_products.assert_called_once()
    mock_exchange_repo.return_value.fetch_exchange_rate.assert_called_once()
