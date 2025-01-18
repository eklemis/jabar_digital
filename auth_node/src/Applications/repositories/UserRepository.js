class UserRepository {
  /**
   * Add a user to the repository.
   * @param {Object} user - The user object containing NIK, role, and password.
   * @returns {Promise<Object>} - The added user.
   */
  async addUser(user) {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Find a user by their NIK.
   * @param {string} NIK - The user's NIK.
   * @returns {Promise<Object|null>} - The user object or null if not found.
   */
  async findUserByNIK(NIK) {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = UserRepository;
