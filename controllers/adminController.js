const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Function to get all admins (admin only)
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to get the profile of the authenticated admin
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to register a new admin
exports.registerAdmin = async (req, res) => {
  const { first_name, last_name, email, password, phone_number } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    admin = new Admin({
      first_name,
      last_name,
      email,
      password,
      phone_number,
      status: "ACTIVE"
    });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();

    const payload = {
      admin: {
        id: admin.id
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

// Function for admin login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      admin: {
        id: admin.id
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

// Function to edit the profile of the authenticated admin
exports.editAdminProfile = async (req, res) => {
  const { first_name, last_name, phone_number, profile_picture } = req.body;

  try {
    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { first_name, last_name, phone_number, profile_picture },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to handle forgot password functionality
exports.forgotPasswordAdmin = async (req, res) => {
  const { email } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: "Admin not found" });
    }

    const token = crypto.randomBytes(20).toString('hex');

    admin.reset_password_token = token;
    admin.reset_password_expires = Date.now() + 3600000; // 1 hour
    await admin.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      to: admin.email,
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

// Function to reset the admin's password
exports.resetPasswordAdmin = async (req, res) => {
  const { token, password } = req.body;

  try {
    const admin = await Admin.findOne({
      reset_password_token: token,
      reset_password_expires: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({ msg: "Password reset token is invalid or has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);
    admin.reset_password_token = "";
    admin.reset_password_expires = null;

    await admin.save();

    res.json({ msg: "Password has been reset" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
