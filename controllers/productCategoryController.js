const ProductCategory = require("../models/ProductCategory");

// Function to get all product categories
exports.getProductCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to get a single product category by ID
exports.getProductCategoryById = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: "Product category not found" });
    }
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to create a new product category
exports.createProductCategory = async (req, res) => {
  const { name, image, banner_image, status, description } = req.body;

  try {
    let category = new ProductCategory({
      name,
      image,
      banner_image,
      status,
      description
    });

    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to update a product category
exports.updateProductCategory = async (req, res) => {
  const { name, image, banner_image, status, description } = req.body;

  try {
    let category = await ProductCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: "Product category not found" });
    }

    category.name = name || category.name;
    category.image = image || category.image;
    category.banner_image = banner_image || category.banner_image;
    category.status = status || category.status;
    category.description = description || category.description;

    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to delete a product category
exports.deleteProductCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: "Product category not found" });
    }

    await category.remove();
    res.json({ msg: "Product category removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
