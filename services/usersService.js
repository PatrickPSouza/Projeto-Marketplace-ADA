const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../lojaVirtual.db');
const db = new sqlite3.Database(dbPath);

// Criação da tabela usuarios
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  );
`);

async function addUsers(users) {
  const { name, email, password } =
  users;
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}


async function getUsers(){
  let query = 'SELECT * FROM users WHERE 1=1';

  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}



module.exports = {
  addUsers, getUsers,
};
