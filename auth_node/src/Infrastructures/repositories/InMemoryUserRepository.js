const UserRepository = require("../../Domains/users/entities/repositories/UserRepository");

class InMemoryUserRepository extends UserRepository {
  constructor() {
    super();
    this._users = [];
  }

  async addUser({ nik, role, password }) {
    const id = this._users.length + 1;
    const user = { id, nik, role, password };
    this._users.push(user);
    return user;
  }

  async findUserByNIK(nik) {
    return this._users.find((user) => user.nik === nik) || null;
  }
}

module.exports = InMemoryUserRepository;
