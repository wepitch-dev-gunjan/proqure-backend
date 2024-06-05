const express = require("express");
const {
  getUsers,
  getUser,
  registerUser,
  loginUser,
  editUserProfile,
  deleteUser,
  forgotPasswordUser,
  resetPasswordUser
} = require("../controllers/userController");
const { adminAuth, userAuth, adminOrUserAuth } = require("../middlewares/authMiddlewares");
const router = express.Router();

// Route to get all users (admin only)
router.get("/users", adminAuth, getUsers);

// Route to get the profile of the authenticated user
router.get("/users/profile", userAuth, getUser);

// Route to register a new user
router.post("/users/register", registerUser);

// Route for user login
router.post("/users/login", loginUser);

// Route to edit the profile of the authenticated user
router.put("/users/profile", userAuth, editUserProfile);

// Route to delete a user by ID (admin only)
router.delete("/users/:id", adminAuth, deleteUser);

// Route to handle forgot password functionality
router.post("/users/forgot-password", forgotPasswordUser);

// Route to reset the user's password
router.post("/users/reset-password", resetPasswordUser);

module.exports = router;
