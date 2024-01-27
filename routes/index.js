var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  res.render("indexs/indexLogin");
});

router.get("/indexLogado", function (req, res) {
  res.render("indexs/indexLogado", { user: req.cookies.user });
});

module.exports = router;
