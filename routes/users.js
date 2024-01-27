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
  
  
// Recebendo o id do usuário que acabou de ser criado
const userId = await usersService.addUsers(users);

// Armazene o userId na sessão ou em um cookie
req.session.userId = userId; // Usando a sessão

  res.redirect("/users/add" + userId);
});

router.get("/add", async function (req, res, next) {
    // está recebendo o último id já presente no banco de dados
    let lastInsertedId = await usersService.getLastId();
    // necessário fazer um auto incremento, pois na hora de cadastrar um novo usuário, a view exibe o valor já armazenado antes de somar
    lastInsertedId++;
    const userEmail = req.cookies.email; // Obtém o email do cookie
    const userId = req.session.userId
    const user = { id: userId };


  res.render("users/usersCreate",  { lastInsertedId });
  console.log( user, userId, userEmail, lastInsertedId)
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
