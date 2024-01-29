var express = require("express");
var productService = require("../services/productService");
var router = express.Router();
const Product = require("../models/ProductModel");
const authMiddleware = require("../middleware/authMiddleware");

// Configuração do middleware de autenticação para ser usado em todas as rotas deste roteador
router.use(authMiddleware);

//gera a lista de todos os produtos
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

//gera a lista dos produtos do usuário logado
router.get("/userProducts", async function (req, res, next) {
  let productList = null;

  // Construa um objeto de filtro com base nos parâmetros da consulta
  const filter = {
    category: req.query.category,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    order: req.query.order, // Adiciona o parâmetro order
  };

  productList = await productService.getUserProducts(filter, req);

  res.render("products/userProducts", {
    products: productList,
    order: req.query.order,
    category: req.query.category,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    user: req.cookies.user,
  });
});

router.get("/add", async function (req, res, next) {
  res.render("products/productsCreate");
});

//chama a função pra adicionar produtos no banco de dados
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

  await productService.addProduct(product, req);

  res.redirect("/products");
});

//função para deletar produto
router.delete("/delete/:productId", async (req, res) => {
  console.log("ENTROU NO DELETE DE PRODUCTS.JS");
  const productId = req.params.productId;

  try {
    const message = await productService.deleteProduct(productId);
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir o produto" });
  }
});

//função para chamar a page de editar produto e postar as edições

router.get("/:productId", async (req, res) => {
  const productId = req.params.productId;
  const product = await productService.getProductById(productId);

  res.render("products/productEdit", { product });
});

router.post("/:productId", async (req, res) => {
  const productId = req.params.productId;
  const naoSouReqBody = req.body;

  try {
    await productService.editProduct(productId, naoSouReqBody);
    res.redirect("/products/userProducts");
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar o produto" });
  }
});

module.exports = router;
