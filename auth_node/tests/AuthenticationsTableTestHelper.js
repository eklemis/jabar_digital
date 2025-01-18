const pool = require("../src/Infrastructures/database/postgres/pool");

const AuthenticationsTableTestHelper = {
  async cleanTable() {
    await pool.query("TRUNCATE TABLE authentications CASCADE");
  },

  async addToken(token) {
    const query = {
      text: "INSERT INTO authentications (token) VALUES ($1)",
      values: [token],
    };
    await pool.query(query);
  },

  async isTokenExists(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    };
    const result = await pool.query(query);
    return result.rows.length > 0;
  },
};

module.exports = AuthenticationsTableTestHelper;
