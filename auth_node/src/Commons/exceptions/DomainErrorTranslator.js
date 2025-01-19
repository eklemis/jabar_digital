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
    "User with the provided NIK already exists",
  ),
  "ADD_USER_USECASE:MISSING_PROPERTY": new InvariantError(
    "Missing required property",
  ),
  "USER_ENTITY:NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "Missing required property",
  ),
  "NEW_AUTHENTICATION:NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "Missing required property",
  ),
  "NEW_AUTHENTICATION:NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "Missing required property",
  ),
  "USER_ENTITY:NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "Invalid NIK or Password",
  ),
};

module.exports = DomainErrorTranslator;
