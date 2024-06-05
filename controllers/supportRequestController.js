const SupportRequest = require("../models/SupportRequest");

// Function to get all support requests
exports.getSupportRequests = async (req, res) => {
  try {
    const supportRequests = await SupportRequest.find();
    res.json(supportRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to get a single support request by ID
exports.getSupportRequestById = async (req, res) => {
  try {
    const supportRequest = await SupportRequest.findById(req.params.id);
    if (!supportRequest) {
      return res.status(404).json({ msg: "Support request not found" });
    }
    res.json(supportRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to create a new support request
exports.createSupportRequest = async (req, res) => {
  const { name, email, phone_number, ip_address, status, message } = req.body;

  try {
    let supportRequest = new SupportRequest({
      name,
      email,
      phone_number,
      ip_address,
      status: status || 'UNRESOLVED',
      message
    });

    await supportRequest.save();
    res.json(supportRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to update a support request
exports.updateSupportRequest = async (req, res) => {
  const { name, email, phone_number, ip_address, status, message } = req.body;

  try {
    let supportRequest = await SupportRequest.findById(req.params.id);
    if (!supportRequest) {
      return res.status(404).json({ msg: "Support request not found" });
    }

    supportRequest.name = name || supportRequest.name;
    supportRequest.email = email || supportRequest.email;
    supportRequest.phone_number = phone_number || supportRequest.phone_number;
    supportRequest.ip_address = ip_address || supportRequest.ip_address;
    supportRequest.status = status || supportRequest.status;
    supportRequest.message = message || supportRequest.message;

    await supportRequest.save();
    res.json(supportRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Function to delete a support request
exports.deleteSupportRequest = async (req, res) => {
  try {
    const supportRequest = await SupportRequest.findById(req.params.id);
    if (!supportRequest) {
      return res.status(404).json({ msg: "Support request not found" });
    }

    await supportRequest.remove();
    res.json({ msg: "Support request removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
