const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const InvariantError = require("../../Commons/exceptions/InvariantError");
const AuthenticationError = require("../../Commons/exceptions/AuthenticationError");
const UserRepository = require("../../Domains/users/repositories/UserRepository");

class PostgresUserRepository extends UserRepository {
  constructor({ pool }) {
    super();
    this._pool = pool;
  }

  async addUser({ nik, role, password }) {
    const sqlQuery = {
      text: `
        INSERT INTO users (nik, role, password)
        VALUES ($1, $2, $3)
        RETURNING id, nik, role
      `,
      values: [nik, role, password],
    };

    try {
      const result = await this._pool.query(sqlQuery);

      if (!result.rows.length) {
        throw new Error("Failed to Add New User");
      }

      return result.rows[0];
    } catch (error) {
      if (error.constraint === "users_NIK_key") {
        throw new InvariantError("User Already Registered");
      }
      throw error;
    }
  }

  async getUserByNIK(nik) {
    const sqlQuery = {
      // Renamed from `query` to `sqlQuery`
      text: `
        SELECT id, nik, role, password
        FROM users
        WHERE nik = $1
      `,
      values: [nik],
    };

    const result = await this._pool.query(sqlQuery);

    if (!result.rows.length) {
      throw new NotFoundError("User Not Found");
    }

    return result.rows[0];
  }
  async getPasswordByNIK(nik) {
    const query = {
      text: "SELECT password FROM users WHERE nik = $1",
      values: [nik],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError("User Not Exist");
    }

    return result.rows[0].password;
  }
}

module.exports = PostgresUserRepository;
