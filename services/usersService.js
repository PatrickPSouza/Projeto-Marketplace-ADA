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

  // Realiza a inserção
  return new Promise((resolve, reject) => {
    const { name, email, password } = users;
    db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

async function getLastId() {
  return new Promise((resolve, reject) => {
    // Consulta para obter o último ID inserido
    db.get("SELECT MAX(id) AS lastId FROM users", (err, row) => {
      if (err) {
        reject(err);
      } else {
        const lastInsertedId = row.lastId;
        console.log(`Último ID inserido: ${lastInsertedId}`);
        resolve(lastInsertedId);
      }
    });
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

async function getUserIdByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row.id : null);
      }
    });
  });
}

module.exports = {
  addUsers, getUsers,getUserIdByEmail, getLastId
};
