const express = require("express");
const {
  getVendor,
  getVendors,
  loginVendor,
  registerVendor,
  editVendorProfile,
  forgotPasswordVendor,
  resetPasswordVendor,
} = require("../controllers/vendorController");
const { vendorAuth } = require("../middlewares/authMiddlewares");
const router = express.Router();

// Route to get all vendors (admin only)
router.get("/vendors", vendorAuth, getVendors);

// Route to get the profile of the authenticated vendor
router.get("/vendor/profile", vendorAuth, getVendor);

// Route to register a new vendor
router.post("/vendor/register", registerVendor);

// Route for vendor login
router.post("/vendor/login", loginVendor);

// Route to handle forgot password functionality
router.post("/vendor/forgotPassword", forgotPasswordVendor);

// Route to reset the vendor's password
router.post("/vendor/resetPassword", resetPasswordVendor);

// Route to edit the profile of the authenticated vendor
router.put("/vendor/profile", vendorAuth, editVendorProfile);

module.exports = router;
