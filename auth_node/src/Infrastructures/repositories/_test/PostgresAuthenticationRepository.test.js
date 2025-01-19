const pool = require("../../database/postgres/pool");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const PostgresAuthenticationRepository = require("../PostgresAuthenticationRepository");

describe("PostgresAuthenticationRepository", () => {
  let repository;

  beforeEach(() => {
    repository = new PostgresAuthenticationRepository({ pool });
  });

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.resetAllMocks();
    await pool.end();
  });

  describe("addToken", () => {
    it("should add a token to the database", async () => {
      const token = "sample-token";

      await repository.addToken(token);

      const isTokenExists =
        await AuthenticationsTableTestHelper.isTokenExists(token);
      expect(isTokenExists).toBe(true);
    });

    it("should throw an error if the query fails", async () => {
      const token = "sample-token";
      jest
        .spyOn(pool, "query")
        .mockRejectedValueOnce(new Error("Database error"));

      await expect(repository.addToken(token)).rejects.toThrow(
        "AUTHENTICATION_REPOSITORY.ADD_TOKEN_FAILED",
      );
    });
  });

  describe("isTokenValid", () => {
    it("should return true if the token exists", async () => {
      const token = "sample-token";
      await AuthenticationsTableTestHelper.addToken(token);

      const isValid = await repository.isTokenValid(token);
      expect(isValid).toBe(true);
    });

    it("should return false if the token does not exist", async () => {
      const token = "nonexistent-token";

      const isValid = await repository.isTokenValid(token);
      expect(isValid).toBe(false);
    });

    it("should throw an error if the query fails", async () => {
      const token = "sample-token";
      jest
        .spyOn(pool, "query")
        .mockRejectedValueOnce(new Error("Database error"));

      await expect(repository.isTokenValid(token)).rejects.toThrow(
        "AUTHENTICATION_REPOSITORY.CHECK_TOKEN_FAILED",
      );
    });
  });

  describe("deleteToken", () => {
    it("should delete a token from the database", async () => {
      const token = "sample-token";
      await AuthenticationsTableTestHelper.addToken(token);

      await repository.deleteToken(token);

      const isTokenExists =
        await AuthenticationsTableTestHelper.isTokenExists(token);
      expect(isTokenExists).toBe(false);
    });

    it("should throw an error if the query fails", async () => {
      const token = "sample-token";
      jest
        .spyOn(pool, "query")
        .mockRejectedValueOnce(new Error("Database error"));

      await expect(repository.deleteToken(token)).rejects.toThrow(
        "AUTHENTICATION_REPOSITORY.DELETE_TOKEN_FAILED",
      );
    });
  });
});
