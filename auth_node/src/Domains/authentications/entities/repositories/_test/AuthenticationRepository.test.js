const AuthenticationRepository = require("../AuthenticationRepository");

describe("AuthenticationRepository", () => {
  let authenticationRepository;

  beforeEach(() => {
    authenticationRepository = new AuthenticationRepository();
  });

  describe("addToken method", () => {
    it("should throw an error when invoked", async () => {
      // Act & Assert
      await expect(
        authenticationRepository.addToken("token"),
      ).rejects.toThrowError(
        "AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED",
      );
    });
  });

  describe("isTokenValid method", () => {
    it("should throw an error when invoked", async () => {
      // Act & Assert
      await expect(
        authenticationRepository.isTokenValid("token"),
      ).rejects.toThrowError(
        "AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED",
      );
    });
  });

  describe("deleteToken method", () => {
    it("should throw an error when invoked", async () => {
      // Act & Assert
      await expect(
        authenticationRepository.deleteToken("token"),
      ).rejects.toThrowError(
        "AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED",
      );
    });
  });
});
