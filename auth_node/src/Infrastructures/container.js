const { createContainer, asClass, asValue } = require("awilix");
const pool = require("./database/postgres/pool");
const PostgresUserRepository = require("../Infrastructures/repositories/PostgresUserRepository");
const AddUserUseCase = require("../Applications/use_cases/AddUserUseCase");

// Create the container
const container = createContainer();

// Register dependencies
container.register({
  // Database pool
  pool: asValue(pool),

  // Repositories
  userRepository: asClass(PostgresUserRepository).singleton(),

  // Use cases
  addUserUseCase: asClass(AddUserUseCase).singleton(),
});

module.exports = container;
