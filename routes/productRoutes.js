const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const { adminOrVendorAuth } = require("../middlewares/authMiddlewares"); // Ensure this path is correct
const router = express.Router();

// Route to get all products
router.get("/products", getProducts);

// Route to get a single product by ID
router.get("/products/:id", getProductById);

// Route to create a new product
router.post("/products", adminOrVendorAuth, createProduct);

// Route to update an existing product by ID
router.put("/products/:id", adminOrVendorAuth, updateProduct);

// Route to delete a product by ID
router.delete("/products/:id", adminOrVendorAuth, deleteProduct);

module.exports = router;
