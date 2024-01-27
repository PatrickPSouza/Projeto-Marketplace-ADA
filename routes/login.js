const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const session = require('express-session');
const sqlite3 = require('sqlite3');
const path = require('path');

router.use(cookieParser());
router.use(session({
  secret: '1234', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false , maxAge: 30000} 
}));

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const dbPath = path.resolve(__dirname, '../lojaVirtual.db');
  const db = new sqlite3.Database(dbPath);

  try {
    const consulta = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (consulta && consulta.email === email && consulta.password === password) {
      // Armazenar informações em cookies
      res.cookie('userId', consulta.id);
      res.cookie('userEmail', consulta.email);
      
      req.session.sucesso = consulta.id;

      res.redirect('indexLogado');
      
    } else {
      res.send('Credenciais inválidas');
      //res.redirect('back');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno no servidor');
  } finally {
    db.close();
  }
});

module.exports = router;
