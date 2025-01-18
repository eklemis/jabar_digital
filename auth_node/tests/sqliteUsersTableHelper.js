/* istanbul ignore file */
const sqlite3 = require("sqlite3").verbose();

class SQLiteUsersTableHelper {
  /**
   * Initializes the helper with the specified database file.
   * @param {string} databaseFile - Path to the SQLite database file.
   */
  constructor(databaseFile) {
    this._db = new sqlite3.Database(databaseFile);
  }

  /**
   * Cleans up the `users` table by truncating it and resetting the auto-increment ID.
   * @returns {Promise<void>}
   */
  async cleanTable() {
    return new Promise((resolve, reject) => {
      this._db.serialize(() => {
        this._db.run("DELETE FROM users", (err) => {
          if (err) return reject(err);
        });

        this._db.run(
          'DELETE FROM sqlite_sequence WHERE name="users"',
          (err) => {
            if (err) return reject(err);
            resolve();
          },
        );
      });
    });
  }

  /**
   * Seeds the `users` table with initial data.
   * @param {Array<Object>} users - Array of user objects to insert.
   * @returns {Promise<void>}
   */
  async seedTable(users) {
    return new Promise((resolve, reject) => {
      const insertQuery = `
        INSERT INTO users (nik, role, password)
        VALUES (?, ?, ?)
      `;

      this._db.serialize(() => {
        const stmt = this._db.prepare(insertQuery);

        users.forEach((user) => {
          stmt.run([user.nik, user.role, user.password], (err) => {
            if (err) return reject(err);
          });
        });

        stmt.finalize((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });
  }

  /**
   * Closes the database connection.
   * @returns {Promise<void>}
   */
  async closeConnection() {
    return new Promise((resolve, reject) => {
      this._db.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

module.exports = SQLiteUsersTableHelper;
