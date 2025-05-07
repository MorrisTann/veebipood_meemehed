const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getProductBySlug,
} = require("../controllers/productController");

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/products/slug/:slug", getProductBySlug);


module.exports = router;
