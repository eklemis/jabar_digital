const UserRepository = require("../UserRepository");

describe("UserRepository", () => {
  const repository = new UserRepository();

  describe("addUser", () => {
    test("should throw an error when invoked without implementation", async () => {
      await expect(repository.addUser({})).rejects.toThrowError(
        "USER_REPOSITORY.METHOD_NOT_IMPLEMENTED",
      );
    });
  });

  describe("findUserByNIK", () => {
    test("should throw an error when invoked without implementation", async () => {
      await expect(
        repository.findUserByNIK("1234567890123456"),
      ).rejects.toThrowError("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
  });

  describe("getPasswordByNIK", () => {
    test("should throw an error when invoked without implementation", async () => {
      await expect(
        repository.getPasswordByNIK("1234567890123456"),
      ).rejects.toThrowError("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
  });
});
