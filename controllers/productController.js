const Product = require("../models/Product");
const User = require("../models/User");

// Function to get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('owner', 'name email');
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('owner', 'name email');
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to create a new product
exports.createProduct = async (req, res) => {
  const {
    main_image,
    image_gallery,
    admin_sku,
    vendor_sku,
    name,
    type,
    origin,
    base_color,
    price_range,
    thickness_in_mm,
    lot_location,
    height_in_inches,
    width_in_inches,
    quantity,
    total_material,
    bulk_available,
    area_of_usage,
    owner,
    status,
    recommended_usage,
    description
  } = req.body;

  try {
    let user = await User.findById(owner);
    if (!user) {
      return res.status(400).json({ msg: "Owner not found" });
    }

    let product = new Product({
      main_image,
      image_gallery,
      admin_sku,
      vendor_sku,
      name,
      type,
      origin,
      base_color,
      price_range,
      thickness_in_mm,
      lot_location,
      height_in_inches,
      width_in_inches,
      quantity,
      total_material,
      bulk_available,
      area_of_usage,
      owner,
      status,
      recommended_usage,
      description
    });

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to update a product
exports.updateProduct = async (req, res) => {
  const {
    main_image,
    image_gallery,
    admin_sku,
    vendor_sku,
    name,
    type,
    origin,
    base_color,
    price_range,
    thickness_in_mm,
    lot_location,
    height_in_inches,
    width_in_inches,
    quantity,
    total_material,
    bulk_available,
    area_of_usage,
    owner,
    status,
    recommended_usage,
    description
  } = req.body;

  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    product.main_image = main_image || product.main_image;
    product.image_gallery = image_gallery || product.image_gallery;
    product.admin_sku = admin_sku || product.admin_sku;
    product.vendor_sku = vendor_sku || product.vendor_sku;
    product.name = name || product.name;
    product.type = type || product.type;
    product.origin = origin || product.origin;
    product.base_color = base_color || product.base_color;
    product.price_range = price_range || product.price_range;
    product.thickness_in_mm = thickness_in_mm || product.thickness_in_mm;
    product.lot_location = lot_location || product.lot_location;
    product.height_in_inches = height_in_inches || product.height_in_inches;
    product.width_in_inches = width_in_inches || product.width_in_inches;
    product.quantity = quantity || product.quantity;
    product.total_material = total_material || product.total_material;
    product.bulk_available = bulk_available || product.bulk_available;
    product.area_of_usage = area_of_usage || product.area_of_usage;
    product.owner = owner || product.owner;
    product.status = status || product.status;
    product.recommended_usage = recommended_usage || product.recommended_usage;
    product.description = description || product.description;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    await product.remove();
    res.json({ msg: "Product removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
