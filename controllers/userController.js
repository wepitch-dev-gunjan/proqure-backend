const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Function to get all users (admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to get the profile of the authenticated user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to register a new user
exports.registerUser = async (req, res) => {
  const { name, email, other_email, phone_number, password, user_type, ip_address, firm_name, firm_address, gst_number } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      email,
      other_email,
      phone_number,
      password,
      user_type,
      ip_address,
      firm_name,
      firm_address,
      gst_number,
      status: "ACTIVE"
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
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

// Function for user login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id
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

// Function to edit the profile of the authenticated user
exports.editUserProfile = async (req, res) => {
  const { name, other_email, phone_number, profile_picture, user_type, firm_name, firm_address, gst_number } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, other_email, phone_number, profile_picture, user_type, firm_name, firm_address, gst_number },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to handle forgot password functionality
exports.forgotPasswordUser = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const token = crypto.randomBytes(20).toString('hex');

    user.reset_password_token = token;
    user.reset_password_expires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      to: user.email,
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

// Function to reset the user's password
exports.resetPasswordUser = async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      reset_password_token: token,
      reset_password_expires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: "Password reset token is invalid or has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.reset_password_token = "";
    user.reset_password_expires = null;

    await user.save();

    res.json({ msg: "Password has been reset" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await user.remove();
    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
