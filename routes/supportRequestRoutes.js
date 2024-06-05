const express = require("express");
const {
  getSupportRequests,
  getSupportRequestById,
  createSupportRequest,
  updateSupportRequest,
  deleteSupportRequest
} = require("../controllers/supportRequestController");
const { adminAuth } = require("../middlewares/authMiddlewares"); // Assuming you have middleware for admin authentication
const router = express.Router();

// Route to get all support requests
router.get("/support-requests", adminAuth, getSupportRequests);

// Route to get a single support request by ID
router.get("/support-requests/:id", adminAuth, getSupportRequestById);

// Route to create a new support request
router.post("/support-requests", createSupportRequest);

// Route to update an existing support request by ID
router.put("/support-requests/:id", adminAuth, updateSupportRequest);

// Route to delete a support request by ID
router.delete("/support-requests/:id", adminAuth, deleteSupportRequest);

module.exports = router;
