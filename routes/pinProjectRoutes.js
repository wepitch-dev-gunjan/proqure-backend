const express = require("express");
const {
  getPinProjects,
  getPinProjectById,
  createPinProject,
  updatePinProject,
  deletePinProject
} = require("../controllers/pinProjectController");
const { adminOrUserAuth } = require("../middlewares/authMiddlewares"); // Assuming you have middleware for admin or user authentication
const router = express.Router();

// Route to get all pin projects
router.get("/pin-projects", adminOrUserAuth, getPinProjects);

// Route to get a single pin project by ID
router.get("/pin-projects/:id", adminOrUserAuth, getPinProjectById);

// Route to create a new pin project
router.post("/pin-projects", adminOrUserAuth, createPinProject);

// Route to update an existing pin project by ID
router.put("/pin-projects/:id", adminOrUserAuth, updatePinProject);

// Route to delete a pin project by ID
router.delete("/pin-projects/:id", adminOrUserAuth, deletePinProject);

module.exports = router;
