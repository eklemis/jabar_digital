const SQLiteUserRepository = require("../SQLiteUserRepository");
const fs = require("fs");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const SQLiteUsersTableHelper = require("../../../../tests/sqliteUsersTableHelper");

describe("SQLiteUserRepository", () => {
  const testDatabaseFile = "./user-auth_test.sqlite";

  let repository;
  let usersTableHelper;
  beforeAll(async () => {
    repository = new SQLiteUserRepository(testDatabaseFile);
    usersTableHelper = new SQLiteUsersTableHelper(testDatabaseFile);

    await usersTableHelper.cleanTable();
  });
  afterAll(async () => {
    await usersTableHelper.closeConnection();
  });

  afterEach(async () => {
    await usersTableHelper.cleanTable();
  });

  describe("addUser", () => {
    test("should successfully add a user and return the user data", async () => {
      const user = await repository.addUser({
        nik: "1234567890123456",
        role: "user",
        password: "hashedPassword",
      });

      expect(user).toHaveProperty("id", 1);
      expect(user).toHaveProperty("nik", "1234567890123456");
      expect(user).toHaveProperty("role", "user");
      expect(user).toHaveProperty("password", "hashedPassword");
    });

    test("should throw an error when trying to add a user with duplicate nik", async () => {
      await repository.addUser({
        nik: "1234567890123456",
        role: "user",
        password: "hashedPassword",
      });

      await expect(
        repository.addUser({
          nik: "1234567890123456",
          role: "admin",
          password: "anotherHashedPassword",
        }),
      ).rejects.toThrow(InvariantError);
    });

    test("should throw an unexpected error from the database", async () => {
      const spyRun = jest
        .spyOn(repository._db, "run")
        .mockImplementation((_, __, callback) => {
          const error = new Error("Unexpected database error");
          callback(error);
        });

      await expect(
        repository.addUser({
          nik: "1234567890123456",
          role: "user",
          password: "hashedPassword",
        }),
      ).rejects.toThrowError("Unexpected database error");

      spyRun.mockRestore();
    });
  });

  describe("findUserByNIK", () => {
    test("should return user data when a user with the given NIK exists", async () => {
      const nik = "1234567890123456";

      await repository.addUser({
        nik,
        role: "user",
        password: "hashedPassword",
      });

      const user = await repository.findUserByNIK(nik);

      expect(user).toHaveProperty("id", 1);
      expect(user).toHaveProperty("nik", nik);
      expect(user).toHaveProperty("role", "user");
      expect(user).toHaveProperty("password", "hashedPassword");
    });

    test("should return null when no user with the given NIK exists", async () => {
      const user = await repository.findUserByNIK("nonexistentNIK");
      expect(user).toBeNull();
    });

    test("should throw an unexpected error from the database", async () => {
      // Mock the `get` method to simulate an unexpected error
      const spyGet = jest
        .spyOn(repository._db, "get")
        .mockImplementation((_, __, callback) => {
          const error = new Error("Unexpected database error in findUserByNIK");
          callback(error, null);
        });

      await expect(
        repository.findUserByNIK("1234567890123456"),
      ).rejects.toThrowError("Unexpected database error in findUserByNIK");

      spyGet.mockRestore(); // Restore the original behavior
    });
  });
});
