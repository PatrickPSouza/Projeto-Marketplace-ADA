const path = require("path");
var sqlite3 = require("sqlite3").verbose();
// const faker = require('faker');

var db = new sqlite3.Database("lojaVirtual.db");

async function getProducts(filter) {
  let query = "SELECT * FROM products WHERE 1=1";

  if (filter.category) {
    query += ` AND category = '${filter.category}'`;
  }

  if (filter.minPrice) {
    query += ` AND price >= ${filter.minPrice}`;
  }

  if (filter.maxPrice) {
    query += ` AND price <= ${filter.maxPrice}`;
  }

  if (filter.order === "pricedecrease") {
    query += " ORDER BY price DESC";
  } else if (filter.order === "priceincrease") {
    query += " ORDER BY price ASC";
  }

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

async function addProduct(product) {
  const { name, price, brand, model, category, description, linkimage } =
    product;
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO products (name, price, brand, model, category, description, linkimage) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, price, brand, model, category, description, linkimage],
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

async function getProductsPriceDecrease(filter) {
  let query = "SELECT * FROM products WHERE 1=1";

  if (filter.category) {
    query += ` AND category = '${filter.category}'`;
  }

  if (filter.price) {
    if (filter.price.$gte !== undefined) {
      query += ` AND price >= ${filter.price.$gte}`;
    }
    if (filter.price.$lte !== undefined) {
      query += ` AND price <= ${filter.price.$lte}`;
    }
  }

  query += " ORDER BY price DESC";

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
/*
function insertAutomatico() {
  const dbPath = path.resolve(__dirname, '../lojaVirtual.db');
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    // Criação da tabela (opcional se a tabela já existir)
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        linkimage TEXT
      );
    `);

    // Gerar 20 inserções aleatórias
    for (let i = 0; i < 10; i++) {
      const novoRegistro = {
        name: faker.random.arrayElement(['Computador', 'Notebook Gamer', 'Teclado', 'Mouse', 'Monitor', 'Impressora', 'Roteador', 'Disco Rígido', 'SSD']),
        price: faker.random.number({ min: 800, max: 15000 }),
        brand: faker.random.arrayElement(['Logitech', 'Microsoft', 'HyperX', 'Dell']),
        model: faker.lorem.word(),
        category: faker.random.arrayElement(["perifericos", "hardware", "redes"]),
        description: faker.lorem.sentence(),
      };

      const sqlInserir = `
        INSERT INTO products (name, price, brand, model, category, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.run(
        sqlInserir,
        [novoRegistro.name, novoRegistro.price, novoRegistro.brand, novoRegistro.model, novoRegistro.category, novoRegistro.description],
        function (err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log(`Registro inserido com ID: ${this.lastID}`);
          }
        }
      );
    } // fim do for
  });

insertAutomatico();
*/
module.exports = {
  getProducts,
  addProduct,
  getProductsPriceDecrease,
  //insertAutomatico,
};
