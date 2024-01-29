var express = require("express");
var router = express.Router();

//pagina inicial de login
router.get("/", function (req, res) {
  res.render("indexs/indexLogin");
});

//página de quando o login é autenticado com sucesso
router.get("/indexLogado", function (req, res) {
  res.render("indexs/indexLogado", { user: req.cookies.user });
});

module.exports = router;
