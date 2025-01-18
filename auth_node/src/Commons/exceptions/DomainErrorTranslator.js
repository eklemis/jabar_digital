const InvariantError = require("./InvariantError");
const AuthorizationError = require("./AuthorizationError");
const NotFoundError = require("./NotFoundError");

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  "ADD_USER_USECASE:INVALID_NIK_FORMAT": new InvariantError(
    "Invalid NIK format",
  ),
  "USER_REPOSITORY:ALREADY_REGISTERED": new InvariantError(
    "User with this NIK already exists",
  ),
};

module.exports = DomainErrorTranslator;
