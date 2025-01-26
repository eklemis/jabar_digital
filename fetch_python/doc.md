Activate virtual env:`source venv/bin/activate`

Tests
`pytest -v --tb=short --disable-warnings` or `pytest --rich -v`
for async test: `pytest --asyncio-mode=auto -v --tb=short --disable-warnings`
see test coverage: `pytest --cov=src --cov-report=term-missing`


run the server `uvicorn src.main:app --reload`
