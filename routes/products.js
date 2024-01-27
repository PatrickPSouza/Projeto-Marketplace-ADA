var express = require("express");
var productService = require("../services/productService");
var router = express.Router();
const Product = require("../models/ProductModel");

router.get("/", async function (req, res, next) {

  let productList = null;

  // Construa um objeto de filtro com base nos parâmetros da consulta
  const filter = {
    category: req.query.category,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    order: req.query.order, // Adiciona o parâmetro order
  };

  productList = await productService.getProducts(filter);

  res.render("products/products", {
    products: productList,
    order: req.query.order,
    category: req.query.category,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
  });
});

router.get("/add", async function (req, res, next) {
  res.render("products/productsCreate");
});

router.post("/add", async function (req, res, next) {
  const { name, price, brand, model, category, description, linkimage } =
    req.body;

  const product = new Product(
    name,
    price,
    brand,
    model,
    category,
    description,
    linkimage
  );

  await productService.addProduct(product);

  res.redirect("/products");
});
 
module.exports = router;
