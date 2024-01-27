const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const sqlite3 = require("sqlite3");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");



router.post("/", async (req, res, next) => {
  const { email, password } = req.body;

  const dbPath = path.resolve(__dirname, "../lojaVirtual.db");
  const db = new sqlite3.Database(dbPath);

  try {
    const user = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (user && user.email === email && user.password === password) {
      // Armazenar informações em cookies
      res.cookie("user", user);
      res.cookie('email', email);

      req.session.sucesso = user.id;

      // Chama o próximo middleware (authMiddleware) aqui fora do bloco try-catch-finally
      res.redirect("/indexLogado");
    } else {
      console.log("entrou no else");
      // Altera o status HTTP para indicar que ocorreu um erro
      res.status(401).send("Credenciais inválidas");
      // Não chama next() se houver um erro
    }
  } catch (error) {
    console.error(error);
    // Altera o status HTTP para indicar um erro interno
    res.status(500).send("Erro interno no servidor");
    // Não chama next() se houver um erro
  } finally {
    db.close();
  }
});

// Remova esta linha, pois o next() já está sendo chamado dentro do bloco try

module.exports = router;
