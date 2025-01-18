/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const UsersTableTestHelper = {
  async addUser({
    id = "user-123",
    username = "kestion",
    password = "secret",
    fullname = "Ekstion Indonesia",
  }) {
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4)",
      values: [id, username, password, fullname],
    };

    await pool.query(query);
  },

  async findUsersById(id) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async findUsersByUsername(username) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE username = $1",
      values: [username],
    };

    const result = await pool.query(query);
    return result.rows; // Returns an array of users matching the username
  },

  async cleanTable() {
    await pool.query("DELETE FROM users WHERE 1=1");
  },
};

module.exports = UsersTableTestHelper;
