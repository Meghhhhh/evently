const { ApiError } = require("../utils/ApiError.js");

const isAdmin = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized request");
  }
  if (req.user.userType !== "admin") {
    return next(new ApiError(403, "Access denied. Admins only."));
  }

  next();
};

const isVendor = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized request");
  }
  if (req.user.userType !== "vendor") {
    return next(new ApiError(403, "Access denied. Vendors only."));
  }

  next();
};

module.exports = { isAdmin, isVendor };
