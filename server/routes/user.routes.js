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
 
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.post("/forgot-password/request-otp", forgetPassword);
router.post("/forgot-password/verify-otp", resetPasswordWithOtp);

// Secured routes
router.post("/verify", verifyJWT, verifyUser);
router.post("/resend-otp", verifyJWT, resendOTP);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

module.exports = router;
