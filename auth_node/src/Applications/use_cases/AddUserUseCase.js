const bcrypt = require("bcrypt");
const validateNIK = require("../../Commons/utils/validateNIK");

class AddUserUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute({ nik, role }) {
    // Validate the NIK
    if (!validateNIK(nik)) {
      throw new Error("ADD_USER_USECASE:INVALID_NIK_FORMAT");
    }

    // Generate a random 6-character password
    const plainPassword = Math.random().toString(36).substring(2, 8);

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

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
  }
}

module.exports = AddUserUseCase;
