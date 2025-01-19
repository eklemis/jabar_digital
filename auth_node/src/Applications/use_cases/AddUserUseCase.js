const validateNIK = require("../../Commons/utils/validateNIK");

class AddUserUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute({ nik, role }) {
    if (!nik || !role) {
      throw new Error("ADD_USER_USECASE:MISSING_PROPERTY");
    }
    // Validate the NIK
    if (!validateNIK(nik)) {
      throw new Error("ADD_USER_USECASE:INVALID_NIK_FORMAT");
    }

    // Generate a random 6-character password
    const plainPassword = Math.random().toString(36).substring(2, 8);

    try {
      // Hash the password
      const hashedPassword = await this._passwordHash.hash(plainPassword);

      // Save the user to the repository
      const user = await this._userRepository.addUser({
        nik,
        role,
        password: hashedPassword,
      });

      // Return user details along with the plain password
      return {
        id: user.id,
        nik: user.nik,
        role: user.role,
        password: plainPassword,
      };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = AddUserUseCase;
