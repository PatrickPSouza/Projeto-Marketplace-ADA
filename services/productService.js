
const path = require("path");
var sqlite3 = require("sqlite3").verbose();

const dbPath = path.resolve(__dirname, '../lojaVirtual.db');
const db = new sqlite3.Database(dbPath);


//gera a lista de todos os produtos
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
//gera a lista de todos os produtos do usuário logado
async function getUserProducts(filter, req) {
  const idUserLogado = req.app.locals.idUserLogado;  // Obtém o id do usuário logado

  let query = "SELECT * FROM products WHERE idUserLogado = ?";

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
    db.all(query, [idUserLogado], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// adicionando os dados recebidos, na tabela products
async function addProduct(product, req) {
  const idUserLogado = req.app.locals.idUserLogado;

  db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    linkimage TEXT NOT NULL,
    idUserLogado INTEGER NOT NULL
  );
`);


  const { name, price, brand, model, category, description, linkimage } =
    product;
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO products (name, price, brand, model, category, description, linkimage, idUserLogado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, price, brand, model, category, description, linkimage, idUserLogado],
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

module.exports = {
  getProducts,
  addProduct,
  getProductsPriceDecrease,
  getUserProducts
};
