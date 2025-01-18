const InvariantError = require("../../Commons/exceptions/InvariantError");
const UserRepository = require("../../Applications/repositories/UserRepository");
const sqlite3 = require("sqlite3").verbose();

class SQLiteUserRepository extends UserRepository {
  constructor(databaseFile) {
    super();
    this._db = new sqlite3.Database(databaseFile);
    this._db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nik TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL,
        password TEXT NOT NULL
      )
    `);
  }

  async addUser({ nik, role, password }) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO users (nik, role, password)
        VALUES (?, ?, ?)
      `;
      this._db.run(query, [nik, role, password], function (err) {
        if (err) {
          if (err.message.includes("UNIQUE constraint failed: users.nik")) {
            return reject(
              new InvariantError("USER_REPOSITORY:ALREADY_REGISTERED"),
            );
          }
          return reject(err);
        }
        resolve({ id: this.lastID, nik, role, password });
      });
    });
  }

  async findUserByNIK(nik) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT id, nik, role, password
        FROM users
        WHERE nik = ?
      `;
      this._db.get(query, [nik], (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  }
}

module.exports = SQLiteUserRepository;
