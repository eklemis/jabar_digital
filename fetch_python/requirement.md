Let's start with the first feature: **Fetching product data with price conversion.**

### Step 1: Define the requirements and test cases

#### Requirements:
1. Create an endpoint to fetch data from the external product API.
2. Validate the JWT token before processing.
3. Convert the product price from USD to IDR using an external currency conversion API.
4. Ensure that the response includes the new field `price_idr` in the output.
5. Return appropriate error responses if the JWT token is invalid.

#### Test Cases:
- **Valid Request:**
  - Given a valid JWT token
  - When requesting product data
  - Then it should return products with `price_idr` included.

- **Invalid JWT:**
  - Given an invalid JWT token
  - When requesting product data
  - Then it should return a 401 Unauthorized response.

- **Currency Conversion API Error:**
  - Given the currency conversion API is unavailable
  - When requesting product data
  - Then it should return a 500 Internal Server Error.

---



### Step 3: Implement the feature

Once tests are in place, we will proceed with implementing:

1. **Service Layer (Application Layer)** to handle the business logic.
2. **Infrastructure Layer** to interact with external APIs.
3. **Interface Layer** to expose the API via FastAPI routes.

---

Would you like me to proceed with writing the service implementation?
