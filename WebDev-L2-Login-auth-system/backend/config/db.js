const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dbDir = path.join(__dirname, '..', 'database');
const dbPath = path.join(dbDir, 'database.sqlite');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
}

const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error('Unable to connect to SQLite database:', error.message);
  } else {
    console.log('SQLite database connected.');
  }
});

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  });
}

module.exports = { db, initializeDatabase };
