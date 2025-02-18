# User Authentication API

This project is a Node.js-based authentication API implementing Clean Architecture principles and built using Test-Driven Development (TDD). The API provides user registration, login, and access to private claims using JWT authentication.

## Features
- **User Registration**: Register new users with a unique NIK and role.
- **User Login**: Authenticate users with NIK and password to receive JWT tokens.
- **Private Claims**: Retrieve user claims using JWT authentication.
- **PostgreSQL Database**: Data persistence with secure user password hashing.
- **Comprehensive Testing**: Built with TDD, achieving high test coverage.
- **Docker Support**: Easily containerized for deployment.
- **Swagger API Documentation**: Interactive documentation available via `/doc` route.

## Project Structure
```
/auth_node
│-- src
│   ├── Applications
│   │   ├── use_cases
│   │   └── security
│   ├── Commons
│   │   ├── exceptions
│   │   └── utils
│   ├── Domains
│   │   ├── users
│   │   └── authentications
│   ├── Infrastructures
│   │   ├── database
│   │   ├── http
│   │   ├── repositories
│   │   └── security
│   ├── Interfaces
│   │   ├── http
│   │   │   └── api
│   │   └── middlewares
│   ├── server.js
│   └── container.js
├── tests
├── migrations
├── .env
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Clean Architecture Approach
This project follows Clean Architecture principles to ensure scalability, maintainability, and testability. It is structured into distinct layers:

1. **Domains**: Contains core business rules and entities.
2. **Applications**: Contains use cases that implement business rules.
3. **Infrastructures**: Handles database access, security, and external integrations.
4. **Interfaces**: Manages API routes, controllers, and middleware.

Each layer follows the dependency rule, ensuring higher-level policies do not depend on lower-level details.

## Importance of Test-Driven Development (TDD)
TDD was employed to develop this project, which ensures:

- **Better Code Quality**: By writing tests first, the code is structured to meet specific requirements and reduce errors.
- **Refactoring Confidence**: Developers can safely refactor code with a comprehensive test suite.
- **Improved Collaboration**: Easier understanding of features via well-defined tests.
- **Reduced Debugging Time**: Faster identification and resolution of issues.

## Prerequisites
Ensure you have the following installed:
- Node.js (>=16.x)
- PostgreSQL
- Docker (optional)
- Postman (for API testing)

## Database Creation
### Login to Postgres:
```
psql -U postgres
```

### Create databases for production and test as well as new user
**Create Databases**
```
CREATE DATABASE "user-auth";
CREATE DATABASE "user-auth_test";
```

**Create User**
```
CREATE USER developer WITH PASSWORD 'supersecretpassword';
```

**Grant Ownership to the developer User**
```
ALTER DATABASE "user-auth" OWNER TO developer;
ALTER DATABASE "user-auth_test" OWNER TO developer;
```

## Change active directory:
```sh
cd auth_node
```
## Install dependencies
```sh
npm install
```

## Migrate Postgres Database
### Run migration for production database
```sh
npm run migrate up
```

### Run migration for test database
```sh
npm run migrate:test up
```

## Run All Tests
```sh
npm test
```

## Run Application
```sh
npm start
```

## Running the API with Docker

### 1. Deploying with Dockerfile
1. **Build the Docker image**
   ```sh
   docker build -t auth-node .
   ```

2. **Run the container**
   ```sh
   docker run -p 3000:3000 --env-file .env auth-node
   ```

### 2. Deploying with Docker Compose
1. **Create the Docker Compose file `docker-compose.yml`**
   ```yaml
   version: '3.8'

   services:
     db:
       image: postgres:14
       container_name: auth_postgres
       restart: always
       environment:
         POSTGRES_USER: ${PGUSER}
         POSTGRES_PASSWORD: ${PGPASSWORD}
         POSTGRES_DB: ${PGDATABASE}
       ports:
         - "${PGPORT}:5432"
       volumes:
         - pgdata:/var/lib/postgresql/data

     app:
       build: .
       container_name: auth_api
       depends_on:
         - db
       env_file:
         - .env
       ports:
         - "${PORT}:${PORT}"
       environment:
         NODE_ENV: production
       restart: always
       command: sh -c "sleep 10 && npm run migrate up && npm start"

   volumes:
     pgdata:
   ```

2. **Start the services**
   ```sh
   docker-compose up --build -d
   ```

3. **Stop the services**
   ```sh
   docker-compose down
   ```

4. **Check running containers**
   ```sh
   docker ps
   ```

5. **View logs**
   ```sh
   docker-compose logs -f
   ```

## Try the API via Postman
1. Ensure Postman is installed.
2. Import the provided Postman Collection and Environment inside folder `postman`.
3. Run the test cases to verify API functionality.

To prevent your production database from being polluted with Postman data, always run this project with `npm run start:dev`
This way, the test database will be used to store the new data instead.

Also, make sure that the tables in the chosen database are empty to prevent duplicate data from affecting the tests.
Run this in your chosen PostgreSQL instance to clean up all tables:
```sql
TRUNCATE users CASCADE;
```

## Interactive Swagger OpenAPI Documentation
Access the API documentation via the `/doc` route once the server is running.

## API Endpoints
| Method | Endpoint               | Description               |
|--------|------------------------|---------------------------|
| POST   | /users/register         | Register a new user       |
| POST   | /users/login            | Login and get JWT tokens  |
| GET    | /users/private/claims    | Retrieve user claims      |

## Environment Variables
Set up a `.env` file in the root directory with the following variables:

```
# HTTP SERVER
HOST=localhost
PORT=3000

# TOKENIZE
ACCESS_TOKEN_KEY=youraccesstokenkey
REFRESH_TOKEN_KEY=yourrefreshtokenkey
ACCCESS_TOKEN_AGE=3000

# POSTGRES
PGHOST=localhost
PGUSER=developer
PGDATABASE=user-auth
PGPASSWORD=supersecretpassword
PGPORT=5432

# POSTGRES TEST
PGHOST_TEST=localhost
PGUSER_TEST=developer
PGDATABASE_TEST=user-auth_test
PGPASSWORD_TEST=supersecretpassword
PGPORT_TEST=5432
```

You can change the `PORT` and `HOST` as you wish if still available on your server machine.

## Troubleshooting
- Ensure PostgreSQL is running.
- Check `.env` variables are correctly set.
- Review logs in case of errors: `npm run start:dev`.
