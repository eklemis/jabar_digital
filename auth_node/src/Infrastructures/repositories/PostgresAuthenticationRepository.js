const AuthenticationRepository = require("../../Domains/authentications/repositories/AuthenticationRepository");

class PostgresAuthenticationRepository extends AuthenticationRepository {
  constructor({ pool }) {
    super();
    this._pool = pool;
  }

  async addToken(token) {
    const query = {
      text: "INSERT INTO authentications (token) VALUES ($1)",
      values: [token],
    };

    try {
      await this._pool.query(query);
    } catch (error) {
      console.error(error);
      throw new Error("AUTHENTICATION_REPOSITORY.ADD_TOKEN_FAILED");
    }
  }

  async isTokenValid(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    };

    try {
      const result = await this._pool.query(query);
      return result.rows.length > 0; // Returns true if token exists, false otherwise
    } catch (error) {
      throw new Error("AUTHENTICATION_REPOSITORY.CHECK_TOKEN_FAILED");
    }
  }

  async deleteToken(token) {
    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    };

    try {
      await this._pool.query(query);
    } catch (error) {
      throw new Error("AUTHENTICATION_REPOSITORY.DELETE_TOKEN_FAILED");
    }
  }
}

module.exports = PostgresAuthenticationRepository;
