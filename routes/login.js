const express = require("express");

const variavelLogin = express();
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
      
      // variável global recebe o id do usuário logado
      req.app.locals.idUserLogado = user.id;
      
      console.log('o valor de user id é :' + user.id)
      console.log('o valor da variavel global é:' + req.app.locals.idUserLogado)
      res.redirect("/indexLogado");
    } else {
      res.status(401).send("Credenciais inválidas");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno no servidor");
  } finally {
    db.close();
  }
});


module.exports = router;
