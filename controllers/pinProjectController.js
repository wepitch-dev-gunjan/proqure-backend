const PinProject = require("../models/PinProject");
const User = require("../models/User");
const Product = require("../models/Product");

// Function to get all pin projects
exports.getPinProjects = async (req, res) => {
  try {
    const pinProjects = await PinProject.find().populate('user', 'name email').populate('products', 'name admin_sku vendor_sku');
    res.json(pinProjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to get a single pin project by ID
exports.getPinProjectById = async (req, res) => {
  try {
    const pinProject = await PinProject.findById(req.params.id).populate('user', 'name email').populate('products', 'name admin_sku vendor_sku');
    if (!pinProject) {
      return res.status(404).json({ msg: "Pin project not found" });
    }
    res.json(pinProject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to create a new pin project
exports.createPinProject = async (req, res) => {
  const { name, user, products, status, location } = req.body;

  try {
    let userExists = await User.findById(user);
    if (!userExists) {
      return res.status(400).json({ msg: "User not found" });
    }

    let pinProject = new PinProject({
      name,
      user,
      products,
      status,
      location
    });

    await pinProject.save();
    res.json(pinProject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to update a pin project
exports.updatePinProject = async (req, res) => {
  const { name, user, products, status, location } = req.body;

  try {
    let pinProject = await PinProject.findById(req.params.id);
    if (!pinProject) {
      return res.status(404).json({ msg: "Pin project not found" });
    }

    if (user) {
      let userExists = await User.findById(user);
      if (!userExists) {
        return res.status(400).json({ msg: "User not found" });
      }
      pinProject.user = user;
    }

    pinProject.name = name || pinProject.name;
    pinProject.products = products || pinProject.products;
    pinProject.status = status || pinProject.status;
    pinProject.location = location || pinProject.location;

    await pinProject.save();
    res.json(pinProject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to delete a pin project
exports.deletePinProject = async (req, res) => {
  try {
    const pinProject = await PinProject.findById(req.params.id);
    if (!pinProject) {
      return res.status(404).json({ msg: "Pin project not found" });
    }

    await pinProject.remove();
    res.json({ msg: "Pin project removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
