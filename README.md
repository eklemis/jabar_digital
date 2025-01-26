# Product API & Auth API Documentation

## Overview

The **Product API** and **Auth API** are two integrated web services designed to provide secure access to product-related data and authentication functionalities. These applications work together to ensure that only authorized users can access sensitive product data while enabling authentication and authorization through JWT tokens.

Both applications are designed using **Clean Architecture**, ensuring maintainability and flexibility. The development follows **Test-Driven Development (TDD)** practices to guarantee high code quality and comprehensive test coverage. Interactive API documentation is provided via **Swagger/OpenAPI** for both services.

---

## Architecture Overview

### **Auth API**
- **Purpose:**
  The Auth API handles user authentication, authorization, and token management.
- **Key Features:**
  - User registration and login (`/users/register`, `/users/login`)
  - Token generation and validation
  - Private claims endpoint (`/users/private/claims`)
- **Technology Stack:**
  - **Backend:** Node.js (Express)
  - **Database:** PostgreSQL
  - **Security:** JWT for token-based authentication

### **Product API**
- **Purpose:**
  The Product API provides product-related data, including price conversion and aggregation.
- **Key Features:**
  - Secure product retrieval with JWT verification (`/products`)
  - Aggregated product data sorted by price (`/aggregated-products`)
  - User claim retrieval (`/users/private/claims`)
- **Technology Stack:**
  - **Backend:** FastAPI (Python)
  - **Security:** JWT validation from the Auth API

---

## Interaction Between APIs

1. **User Authentication Flow:**
    - A user registers or logs in via the Auth API (`/users/register` or `/users/login`).
    - The Auth API generates a JWT token and returns it to the client.
    - The client includes the token in the `Authorization` header for subsequent requests to the Product API.

2. **Accessing Product Data:**
    - The client makes a request to the Product API `/products` or `/aggregated-products`.
    - The Product API verifies the provided JWT by decoding it using the shared `ACCESS_TOKEN_KEY`.
    - If the token is valid, product data is returned; otherwise, an `Unauthorized` response is sent.

3. **Fetching User Claims:**
    - The client requests `/users/private/claims` on the Product API.
    - The Product API validates the JWT and returns user-specific claim data (e.g., `id`, `role`).
    - The same endpoint exists in the Auth API for cross-verification.

---

## Deployment

Both applications can be deployed using **Docker** with the provided `docker-compose.yml` files.

### Prerequisites
- Install Docker and Docker Compose
- Clone the single repositoy:
```sh
git clone https://github.com/eklemis/jabar_digital.git
```

To work with the Auth API
```sh
cd auth_node
```

To work with Product API
```sh
cd fetch_python
```

Refer to `README.md` inside each folder to see more detail documentation.

___

## API Endpoints

### **Auth API Endpoints**
| Method | Endpoint             | Description               | Authentication |
|--------|---------------------|---------------------------|----------------|
| POST   | `/users/register`      | Register new user          | No             |
| POST   | `/users/login`         | Authenticate and get token | No             |
| GET    | `/users/profile`       | Get logged-in user profile | Yes            |
| GET    | `/users/private/claims` | Get user private claims   | Yes            |

For full documentation, visit [Auth API README.md](auth_node/README.md).

---

### **Product API Endpoints**
| Method | Endpoint               | Description                           | Authentication |
|--------|-----------------------|---------------------------------------|----------------|
| GET    | `/products`             | Fetch product list with IDR prices    | Yes             |
| GET    | `/aggregated-products`  | Get aggregated product data           | Yes (Admin only)|
| GET    | `/users/private/claims` | Get user claims based on JWT token    | Yes             |

For full documentation, visit [Product API README.md](fetch_python/README.md).

---

## Security Considerations

- **Token Expiry Handling:**
  Ensure that tokens have a reasonable expiry time and are refreshed periodically.
- **Environment Isolation:**
  Keep separate `.env` files for production and development environments.

---
