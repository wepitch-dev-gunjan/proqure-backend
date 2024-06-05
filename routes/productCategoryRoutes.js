const express = require("express");
const {
  getProductCategories,
  getProductCategoryById,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory
} = require("../controllers/productCategoryController");
const { adminAuth } = require("../middlewares/authMiddlewares"); // Assuming you have middleware for admin authentication
const router = express.Router();

// Route to get all product categories
router.get("/categories", getProductCategories);

// Route to get a single product category by ID
router.get("/categories/:id", getProductCategoryById);

// Route to create a new product category
router.post("/categories", adminAuth, createProductCategory);

// Route to update an existing product category by ID
router.put("/categories/:id", adminAuth, updateProductCategory);

// Route to delete a product category by ID
router.delete("/categories/:id", adminAuth, deleteProductCategory);

module.exports = router;
