const DomainErrorTranslator = require("../DomainErrorTranslator");
const InvariantError = require("../InvariantError");

describe("DomainErrorTranslator", () => {
  it("should translate error correctly", () => {
    expect(
      DomainErrorTranslator.translate(
        new Error("ADD_USER_USECASE:INVALID_NIK_FORMAT"),
      ),
    ).toStrictEqual(new InvariantError("Invalid NIK format"));
    expect(
      DomainErrorTranslator.translate(
        new Error("USER_REPOSITORY:ALREADY_REGISTERED"),
      ),
    ).toStrictEqual(new InvariantError("User with this NIK already exists"));
  });

  it("should return original error when error message is not needed to translate", () => {
    // Arrange
    const error = new Error("some_error_message");

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
