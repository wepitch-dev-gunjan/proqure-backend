const jwt = require("jsonwebtoken");

// Middleware to verify admin authentication
exports.adminAuth = (req, res, next) => {
  // Get token from Authorization header
  const token = req.header("Authorization")?.split(' ')[1];

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Assuming the token payload contains the user object

    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Permission denied" });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware to verify user authentication
exports.userAuth = (req, res, next) => {
  // Get token from Authorization header
  const token = req.header("Authorization")?.split(' ')[1];

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Assuming the token payload contains the user object

    // Check if the user is a regular user
    if (req.user.role !== "user") {
      return res.status(403).json({ msg: "Permission denied" });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware to verify vendor authentication
exports.vendorAuth = (req, res, next) => {
  // Get token from Authorization header
  const token = req.header("Authorization")?.split(' ')[1];

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Assuming the token payload contains the user object

    // Check if the user is a vendor
    if (req.user.role !== "vendor") {
      return res.status(403).json({ msg: "Permission denied" });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware to verify admin or user authentication
exports.adminOrUserAuth = (req, res, next) => {
  // Get token from Authorization header
  const token = req.header("Authorization")?.split(' ')[1];

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Assuming the token payload contains the user object

    // Check if the user is either admin or user
    if (req.user.role !== "admin" && req.user.role !== "user") {
      return res.status(403).json({ msg: "Permission denied" });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware to verify admin or vendor authentication
exports.adminOrVendorAuth = (req, res, next) => {
  // Get token from Authorization header
  const token = req.header("Authorization")?.split(' ')[1];

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Assuming the token payload contains the user object

    // Check if the user is either admin or vendor
    if (req.user.role !== "admin" && req.user.role !== "vendor") {
      return res.status(403).json({ msg: "Permission denied" });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware to verify admin, user or vendor authentication
exports.adminUserOrVendorAuth = (req, res, next) => {
  // Get token from Authorization header
  const token = req.header("Authorization")?.split(' ')[1];

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Assuming the token payload contains the user object

    // Check if the user is either admin, user, or vendor
    if (req.user.role !== "admin" && req.user.role !== "user" && req.user.role !== "vendor") {
      return res.status(403).json({ msg: "Permission denied" });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
