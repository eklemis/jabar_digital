const LoginUserUseCase = require("../LoginUserUseCase");
const PasswordHash = require("../../../Applications/security/PasswordHash");

describe("LoginUserUseCase", () => {
  it("should authenticate user and return JWT access token", async () => {
    const mockUserRepository = {
      getPasswordByNIK: jest.fn(() => Promise.resolve("hashedPassword")), // Mock the method
      getUserByNIK: jest.fn(() =>
        Promise.resolve({
          id: 123,
          nik: "1234567890123456",
          role: "user",
        }),
      ),
    };
    const mockAuthenticationRepository = {
      addToken: jest.fn(),
    };
    const mockAuthenticationTokenManager = {
      createAccessToken: jest.fn(() => Promise.resolve("accessToken")),
      createRefreshToken: jest.fn(() => Promise.resolve("refreshToken")),
    };
    const mockPasswordHash = {
      comparePassword: jest.fn(() => Promise.resolve()),
    };
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    const useCasePayload = {
      nik: "1234567890123456",
      password: "secret",
    };

    // Act
    const result = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(mockUserRepository.getPasswordByNIK).toHaveBeenCalledWith(
      "1234567890123456",
    );
    expect(mockPasswordHash.comparePassword).toHaveBeenCalledWith(
      "secret",
      "hashedPassword",
    );
    expect(mockUserRepository.getUserByNIK).toHaveBeenCalledWith(
      "1234567890123456",
    );
    expect(
      mockAuthenticationTokenManager.createAccessToken,
    ).toHaveBeenCalledWith({
      id: 123,
      nik: "1234567890123456",
      role: "user",
    });
    expect(mockAuthenticationRepository.addToken).toHaveBeenCalledWith(
      "refreshToken",
    );
    expect(result).toEqual({
      id: 123,
      nik: "1234567890123456",
      role: "user",
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    });
  });
});
