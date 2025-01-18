const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

// Database file paths
const productionDbFile = "user-auth.sqlite";
const testDbFile = "user-auth_test.sqlite";

// SQL to create the `users` table
const createUsersTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nik TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    password TEXT NOT NULL
  )
`;

// Function to initialize a database
function initializeDatabase(dbFile) {
  if (!fs.existsSync(dbFile)) {
    const db = new sqlite3.Database(dbFile);

    db.serialize(() => {
      console.log(`Creating tables in ${dbFile}...`);
      db.run(createUsersTableSQL, (err) => {
        if (err) {
          console.error(`Failed to create tables in ${dbFile}:`, err.message);
        } else {
          console.log(`Tables created successfully in ${dbFile}.`);
        }
      });
    });

    db.close(() => {
      console.log(`Database ${dbFile} initialized.`);
    });
  } else {
    console.log(`Database file ${dbFile} already exists.`);
  }
}

// Initialize both production and test databases
initializeDatabase(productionDbFile);
initializeDatabase(testDbFile);
