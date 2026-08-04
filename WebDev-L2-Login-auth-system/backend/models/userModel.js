const { db } = require('../config/db');

function createUser({ username, email, passwordHash }) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;
    db.run(query, [username, email, passwordHash], function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

function findUserByUsernameOrEmail(identifier) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?) LIMIT 1`;
    db.get(query, [identifier, identifier], (error, user) => {
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
}

function findUserById(id) {
  return new Promise((resolve, reject) => {
    const query = `SELECT id, username, email, created_at FROM users WHERE id = ? LIMIT 1`;
    db.get(query, [id], (error, user) => {
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
}

module.exports = { createUser, findUserByUsernameOrEmail, findUserById };
