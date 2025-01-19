# Authentication API

This project is an authentication API built using **Node.js**, **Express**, and follows the principles of **Clean Architecture**.

## Table of Contents
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)
- [Project Principles](#project-principles)
- [Contributing](#contributing)
- [License](#license)

---

## Project Structure

```
auth_node/
│-- config/
│   ├── database/
│   │   ├── test.json
│-- migrations/
│   ├── 1736980518985_create-users-table.js
│   ├── 1736983471064_rename-NIK-to-nik.js
│   ├── 1737211700204_create-authentications-table.js
│-- src/
│   ├── Applications/           # Application use cases
│   ├── Commons/                # Common utilities and exceptions
│   ├── Domains/                 # Domain entities and repositories
│   │   ├── authentications/
│   │   ├── users/
│   ├── Infrastructures/         # Implementation of repositories, security, and server setup
│   │   ├── database/postgres/
│   │   ├── http/
│   │   ├── repositories/
│   │   ├── security/
│-- tests/
│   ├── AuthenticationsTableTestHelper.js
│   ├── UsersTableTestHelper.js
│   ├── sqliteUsersTableHelper.js
│-- package.json
│-- README.md
```

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd auth_node
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and configure the following:
   ```env
   ACCESS_TOKEN_KEY=your_secret_key
   REFRESH_TOKEN_KEY=your_refresh_secret_key
   DB_HOST=localhost
   DB_USER=your_user
   DB_PASS=your_password
   DB_NAME=your_database
   ```

---

## Configuration

- Database configuration files are located in `config/database/`
- Migrations can be run using `npm run migrate`

---

## Usage

To start the server:
```bash
npm start
```

To start the development server with nodemon:
```bash
npm run dev
```

---

## API Endpoints

### 1. Register a new user
- **POST** `/users/register`
- **Body:**
  ```json
  {
    "nik": "1234567890123456",
    "role": "user"
  }
  ```
- **Success Response:**
  ```json
  {
    "id": 1,
    "nik": "1234567890123456",
    "role": "user",
    "password": "random_generated_password"
  }
  ```

### 2. Login user
- **POST** `/users/login`
- **Body:**
  ```json
  {
    "nik": "1234567890123456",
    "password": "password"
  }
  ```
- **Success Response:**
  ```json
  {
    "id": 1,
    "nik": "1234567890123456",
    "role": "user",
    "accessToken": "jwt_token"
  }
  ```

### 3. Get user claims
- **GET** `/users/private/claims`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```
- **Success Response:**
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "nik": "1234567890123456",
      "role": "user"
    }
  }
  ```

---

## Running Tests

Run tests using:
```bash
npm test
```

To run tests for specific functionality:
```bash
npm test -- -t "test description"
```

---

## Project Principles

This project follows **Clean Architecture**, which promotes separation of concerns through the following layers:
1. **Domains:** Core business logic and rules.
2. **Applications:** Use cases that interact with the domain.
3. **Infrastructures:** Implementations of database repositories and security modules.
4. **Interfaces:** HTTP controllers and routes.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-xyz`)
3. Commit changes (`git commit -m 'Add feature xyz'`)
4. Push to the branch (`git push origin feature-xyz`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See `LICENSE` for details.
