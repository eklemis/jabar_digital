## Database Creation
### Login to Postgres:
`psql -U postgres`

### Create databases for production and test as well as new user
*Create Databases*
```
CREATE DATABASE "user-auth";
CREATE DATABASE "user-auth_test";
```

*Create User*
create user `developer` in postgres;
`CREATE USER developer WITH PASSWORD 'supersecretpassword';`

*Grant Ownership to the developer User*
```
ALTER DATABASE "user-auth" OWNER TO developer;
ALTER DATABASE "user-auth_test" OWNER TO developer;
```

## Install dependencies
run command `npm install`

## Migrate Postgres Database
### Run miration for production database
`npm run migrate up`
### Run migration for test database
`npm run migrate:test up`

## Run All Test
run command `npm test`

## Run Application
run command `npm start`

## Try the API via Postman
Make sure you have postman installed
Import the test file
Run all the test
Should see all test passed
## Interactive Swager Open API Doc via `/doc` Rute
## User Guide
## Containerized the API with Docker
