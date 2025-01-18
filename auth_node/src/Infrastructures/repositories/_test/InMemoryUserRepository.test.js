const InMemoryUserRepository = require("../InMemoryUserRepository");

describe("InMemoryUserRepository", () => {
  let repository;

  beforeEach(() => {
    repository = new InMemoryUserRepository(); // Create a fresh repository for each test
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

    test("should assign unique IDs to each user", async () => {
      const user1 = await repository.addUser({
        nik: "1234567890123456",
        role: "user",
        password: "hashedPassword",
      });

      const user2 = await repository.addUser({
        nik: "6543210987654321",
        role: "admin",
        password: "anotherHashedPassword",
      });

      expect(user1).toHaveProperty("id", 1);
      expect(user2).toHaveProperty("id", 2);
    });
  });

  describe("findUserByNIK", () => {
    test("should return user data when a user with the given NIK exists", async () => {
      const nik = "1234567890123456";

      // Add a user to the repository
      await repository.addUser({
        nik,
        role: "user",
        password: "hashedPassword",
      });

      // Find the user by NIK
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
  });
});
