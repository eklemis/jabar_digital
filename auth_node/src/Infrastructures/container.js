const { createContainer, asClass, asValue } = require("awilix");

const pool = require("./database/postgres/pool");

// User Registration
const PostgresUserRepository = require("../Infrastructures/repositories/PostgresUserRepository");
const AddUserUseCase = require("../Applications/use_cases/AddUserUseCase");

// User Login
const LoginUserUseCase = require("../Applications/use_cases/LoginUserUseCase");
const JwtTokenManager = require("./security/JwtTokenManager");
const BcryptPasswordHash = require("./security/BcryptPasswordHash");
const PostgresAuthenticationRepository = require("../Infrastructures/repositories/PostgresAuthenticationRepository");

// Create the container
const container = createContainer();

// Register dependencies
container.register({
  // Database pool
  pool: asValue(pool),

  // Password Hashing
  passwordHash: asClass(BcryptPasswordHash).singleton(),

  // Repositories
  userRepository: asClass(PostgresUserRepository).singleton(),
  authenticationRepository: asClass(
    PostgresAuthenticationRepository,
  ).singleton(),

  // Security
  authenticationTokenManager: asClass(JwtTokenManager).singleton(),

  // Use cases
  addUserUseCase: asClass(AddUserUseCase).singleton(),
  loginUserUseCase: asClass(LoginUserUseCase).singleton(),
});

module.exports = container;
