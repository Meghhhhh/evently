const { Router } = require("express");
const {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  verifyUser,
  resendOTP,
  forgetPassword,
  resetPasswordWithOtp,
} = require("../controllers/user.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");

const router = Router();
 
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password/request-otp", forgetPassword);
router.post("/forgot-password/verify-otp", resetPasswordWithOtp);

// Secured routes
router.post("/verify", verifyJWT, verifyUser);
router.post("/resend-otp", verifyJWT, resendOTP);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.post("/current-user", verifyJWT, getCurrentUser);
router.patch("/update-account", verifyJWT, updateAccountDetails);

module.exports = router;
