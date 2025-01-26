import pytest
from fastapi.testclient import TestClient
from src.main import app, get_product_usecase
from src.applications.use_cases.fetch_products_usecase import FetchProductsUseCase
from unittest.mock import AsyncMock, Mock
from src.domains.product import Product
from src.domains.exchange_rate import ExchangeRate

client = TestClient(app)

@pytest.fixture
def mock_use_case(mocker):
    mock_use_case = mocker.AsyncMock(spec=FetchProductsUseCase)
    mock_use_case.execute.return_value = [
        {"product": "Bike", "price": "100.00", "department": "Sports"},
    ]
    return mock_use_case

def test_get_products_endpoint(mock_use_case):
    # Override the FastAPI dependency injection
    app.dependency_overrides[get_product_usecase] = lambda: mock_use_case

    response = client.get("/product")

    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "data": [{"product": "Bike", "price": "100.00", "department": "Sports"}]
    }

    # Clear the override after test to prevent side effects
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_get_product_usecase(mocker):
    # Mock the dependencies with AsyncMock for async compatibility
    mock_product_repo = mocker.patch("src.main.ProductRepository", autospec=True)
    mock_exchange_repo = mocker.patch("src.main.ExchangeRateRepository", autospec=True)

    # Set async return values for mock methods with proper domain models
    mock_product_repo.return_value.fetch_products.return_value = [
        Product(
            id="1",
            createdAt="2021-06-09T09:37:05.527Z",
            price=100.00,
            department="Sports",
            product="Bike"
        )
    ]
    mock_exchange_repo.return_value.fetch_exchange_rate.return_value = ExchangeRate(currency="IDR", value=15000.0)

    # Perform the request
    response = client.get("/product")

    # Assertions
    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "data": [
            {
                "id": "1",
                "createdAt": "2021-06-09T09:37:05.527000Z",
                "price": 1500000.0,
                "department": "Sports",
                "product": "Bike"
            }
        ]
    }

    # Ensure mock methods were awaited
    mock_product_repo.return_value.fetch_products.assert_called_once()
    mock_exchange_repo.return_value.fetch_exchange_rate.assert_called_once()
