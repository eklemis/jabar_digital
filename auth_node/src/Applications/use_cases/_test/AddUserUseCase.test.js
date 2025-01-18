const AddUserUseCase = require("../AddUserUseCase");
const bcrypt = require("bcrypt");

jest.mock("bcrypt"); // Mock bcrypt to avoid real hashing in tests

const mockUserRepository = {
  addUser: jest.fn(),
};

describe("AddUserUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully add a user and return the plain password", async () => {
    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
    });

    // Mock bcrypt and repository behavior
    bcrypt.hash.mockResolvedValue("hashedPassword");
    mockUserRepository.addUser.mockResolvedValue({
      id: 1,
      nik: "1234567890123456",
      role: "user",
    });

    // Execute the use case
    const result = await addUserUseCase.execute({
      nik: "1234567890123456",
      role: "user",
    });

    // Assertions
    expect(mockUserRepository.addUser).toHaveBeenCalledWith({
      nik: "1234567890123456",
      role: "user",
      password: "hashedPassword",
    });
    expect(result).toHaveProperty("id", 1);
    expect(result).toHaveProperty("nik", "1234567890123456");
    expect(result).toHaveProperty("role", "user");
    expect(result).toHaveProperty("password"); // Plain password
  });

  test("should throw an error for an invalid NIK", async () => {
    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
    });

    await expect(
      addUserUseCase.execute({
        nik: "invalidNIK",
        role: "user",
      }),
    ).rejects.toThrowError("ADD_USER_USECASE:INVALID_NIK_FORMAT");
  });
});
