const PostgresUserRepository = require("../PostgresUserRepository");
const pool = require("../../database/postgres/pool");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("PostgresUserRepository", () => {
  afterEach(async () => {
    await pool.query("TRUNCATE TABLE users RESTART IDENTITY");
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addUser", () => {
    test("should successfully add a user and return the user data", async () => {
      const repository = new PostgresUserRepository({ pool });

      const user = await repository.addUser({
        nik: "1234567890123456",
        role: "user",
        password: "hashedPassword",
      });

      expect(user).toHaveProperty("id");
      expect(user.nik).toBe("1234567890123456");
      expect(user.role).toBe("user");
    });

    test("should throw InvariantError when trying to add a user with duplicate NIK", async () => {
      const repository = new PostgresUserRepository({ pool });

      // Add the first user
      await repository.addUser({
        nik: "1234567890123456",
        role: "user",
        password: "hashedPassword",
      });

      // Try adding the second user with the same NIK
      await expect(
        repository.addUser({
          nik: "1234567890123456",
          role: "admin",
          password: "anotherHashedPassword",
        }),
      ).rejects.toThrow(InvariantError);

      await expect(
        repository.addUser({
          nik: "1234567890123456",
          role: "admin",
          password: "hashedPassword",
        }),
      ).rejects.toThrow("USER_REPOSITORY:ALREADY_REGISTERED");
    });

    test("should throw an error when no rows are returned", async () => {
      const repository = new PostgresUserRepository({ pool });

      // Mock pool.query to return no rows
      const mockQuery = jest
        .spyOn(pool, "query")
        .mockResolvedValueOnce({ rows: [] });

      await expect(
        repository.addUser({
          nik: "1234567890123456",
          role: "user",
          password: "hashedPassword",
        }),
      ).rejects.toThrowError("USER_REPOSITORY:NO_ROWS_RETURNED");

      mockQuery.mockRestore(); // Restore original behavior
    });
    test("should handle unexpected errors", async () => {
      const repository = new PostgresUserRepository({ pool });

      // Mock pool.query to throw an unexpected error
      const mockQuery = jest
        .spyOn(pool, "query")
        .mockRejectedValueOnce(new Error("Unexpected Error"));

      await expect(
        repository.addUser({
          nik: "1234567890123456",
          role: "user",
          password: "hashedPassword",
        }),
      ).rejects.toThrowError("Unexpected Error");

      mockQuery.mockRestore(); // Restore original behavior
    });
  });

  describe("findUserByNIK", () => {
    test("should return user data if the user exists", async () => {
      const repository = new PostgresUserRepository({ pool });

      // Add a user
      await repository.addUser({
        nik: "1234567890123456",
        role: "user",
        password: "hashedPassword",
      });

      // Retrieve the user
      const user = await repository.findUserByNIK("1234567890123456");

      expect(user).toHaveProperty("id");
      expect(user.nik).toBe("1234567890123456");
      expect(user.role).toBe("user");
    });

    test("should throw NotFoundError if the user is not found", async () => {
      const repository = new PostgresUserRepository({ pool });

      await expect(
        repository.findUserByNIK("1234567890123456"),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
