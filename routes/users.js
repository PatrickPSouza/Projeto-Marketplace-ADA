var express = require("express");
var usersService = require("../services/usersService");
var router = express.Router();
const usersModel = require("../models/usersModel");

router.get("/", async function (req, res, next) {
  let usersList = null;

  // Construa um objeto de filtro com base nos parâmetros da consulta
  const filter = {
    name: req.query.name,
    email: req.query.email
  };

  usersList = await usersService.getUsers(filter);

  res.render("users/users", {
    users: usersList,
    name: req.query.name,
    email: req.query.email
  });
});

router.post("/add", async function (req, res, next) {
  const { name, email, password } = req.body;

  const users = new usersModel(name, email, password);

  await usersService.addUsers(users);

  res.redirect("/users/add");
});

router.get("/add", async function (req, res, next) {
  res.render("users/usersCreate");
});

/*
router.post("/add", async function (req, res, next) {
  const { name, email, telephone, address } =
    req.body;

  const customer = new Customer(
    name, email, telephone, address
  );

  await customerService.addCustomer(customer);

  res.redirect("/products");
});

*/

module.exports = router;
