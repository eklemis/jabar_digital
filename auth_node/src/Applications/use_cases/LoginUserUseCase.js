const UserLogin = require("../../Domains/users/entities/UserLogin");
const NewAuthentication = require("../../Domains/authentications/entities/NewAuthentication");

class LoginUserUseCase {
  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const { nik, password } = new UserLogin(useCasePayload);

    // Fetch hashed password by NIK
    const encryptedPassword = await this._userRepository.getPasswordByNIK(nik);

    // Verify password
    await this._passwordHash.comparePassword(password, encryptedPassword);

    // Fetch user ID and role
    const { id, role } = await this._userRepository.getUserByNIK(nik);

    // Generate access and refresh tokens
    const accessToken =
      await this._authenticationTokenManager.createAccessToken({
        id,
        nik,
        role,
      });
    const refreshToken =
      await this._authenticationTokenManager.createRefreshToken({
        id,
        nik,
        role,
      });

    // Save refresh token to authentication repository
    await this._authenticationRepository.addToken(refreshToken);

    // Return authentication data
    return new NewAuthentication({
      id,
      nik,
      role,
      accessToken,
      refreshToken,
    });
  }
}

module.exports = LoginUserUseCase;
