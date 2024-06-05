const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Function to get all vendors (admin only)
exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to get the profile of the authenticated vendor
exports.getVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id).select("-password");
    res.json(vendor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to register a new vendor
exports.registerVendor = async (req, res) => {
  const { first_name, last_name, email, username, company_name, company_location, password, phone_number, gst_number } = req.body;

  try {
    let vendor = await Vendor.findOne({ email });
    if (vendor) {
      return res.status(400).json({ msg: "Vendor already exists" });
    }

    vendor = new Vendor({
      first_name,
      last_name,
      email,
      username,
      company_name,
      company_location,
      password,
      phone_number,
      gst_number,
      status: "ACTIVE"
    });

    const salt = await bcrypt.genSalt(10);
    vendor.password = await bcrypt.hash(password, salt);

    await vendor.save();

    const payload = {
      vendor: {
        id: vendor.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function for vendor login
exports.loginVendor = async (req, res) => {
  const { email, password } = req.body;

  try {
    let vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      vendor: {
        id: vendor.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to edit the profile of the authenticated vendor
exports.editVendorProfile = async (req, res) => {
  const { first_name, last_name, phone_number, profile_picture, company_name, company_location, gst_number } = req.body;

  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.vendor.id,
      { first_name, last_name, phone_number, profile_picture, company_name, company_location, gst_number },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(vendor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to handle forgot password functionality
exports.forgotPasswordVendor = async (req, res) => {
  const { email } = req.body;

  try {
    let vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ msg: "Vendor not found" });
    }

    const token = crypto.randomBytes(20).toString('hex');

    vendor.reset_password_token = token;
    vendor.reset_password_expires = Date.now() + 3600000; // 1 hour
    await vendor.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      to: vendor.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `http://${req.headers.host}/reset/${token}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('There was an error: ', err);
        return res.status(500).send("Error sending email");
      }
      res.status(200).json({ msg: 'Recovery email sent' });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to reset the vendor's password
exports.resetPasswordVendor = async (req, res) => {
  const { token, password } = req.body;

  try {
    const vendor = await Vendor.findOne({
      reset_password_token: token,
      reset_password_expires: { $gt: Date.now() }
    });

    if (!vendor) {
      return res.status(400).json({ msg: "Password reset token is invalid or has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    vendor.password = await bcrypt.hash(password, salt);
    vendor.reset_password_token = "";
    vendor.reset_password_expires = null;

    await vendor.save();

    res.json({ msg: "Password has been reset" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
