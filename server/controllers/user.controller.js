const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const { User } = require("../models/user.model.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const jwt = require("jsonwebtoken");
const {
  sendVerificationEmail,
} = require("../helpers/sendVerificationEmail.js");
const { sendForgotPasswordEmail } = require("../helpers/sendForgotPasswordEmail.js");

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, userType, contactNumber } =
    req.body;

  if (
    [firstName, lastName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUserVerifiedByEmail = await User.findOne({ email });

  const verifyUserCode = Math.floor(100000 + Math.random() * 900000).toString();

  if (existingUserVerifiedByEmail) {
    throw new ApiError(409, "User with this email already exists");
  }

  // if (existingUserVerifiedByEmail) {
  //   if (existingUserVerifiedByEmail.isVerified) {
  //     throw new ApiError(409, "User with this email already exists");
  //   } else {
  //     existingUserVerifiedByEmail.verifyCode = verifyUserCode;
  //     existingUserVerifiedByEmail.verifyCodeExpiry = new Date(
  //       Date.now() + 3600000
  //     ); // 1 hour expiry
  //     existingUserVerifiedByEmail.userType = userType;
  //     await existingUserVerifiedByEmail.save();

  //     // Send the verification email
  //     const emailResponse = await sendVerificationEmail(
  //       email,
  //       ${firstName} ${lastName},
  //       verifyUserCode
  //     );

  //     if (!emailResponse.success) {
  //       throw new ApiError(
  //         500,
  //         emailResponse.message || "Failed to send verification email"
  //       );
  //     }
 
  //     return res.status(201).json(
  //       new ApiResponse(
  //         201,
  //         {
  //           message: "User registered successfully. Please verify your email",
  //           emailResponse,
  //         },
  //         "User registered"
  //       )
  //     );
  //   }
  // }

  // Create a new user
  const expiryDate = Date.now() + 10 * 60 * 1000;

  const user = await User.create({
    firstName,
    lastName,
    email,
    contactNumber: String(contactNumber),
    password,
    verifyCode: verifyUserCode,
    verifyCodeExpiry: expiryDate,
    isVerified: false,
    userType: userType ?? "ordinary",
  });

  const emailResponse = await sendVerificationEmail(
    email,
    `${firstName} ${lastName}`,
    verifyUserCode
  );

  if (!emailResponse.success) {
    throw new ApiError(
      500,
      emailResponse.message || "Failed to send verification email"
    );
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  user.refreshToken = refreshToken;

  await user.save();

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // important for cross-site
    domain: process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: createdUser,
          accessToken,
          refreshToken,
        },
        "User registered Successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { firstName, lastName, contactNumber } = req.body;

  if (!firstName || !lastName || !contactNumber) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        firstName,
        lastName,
        contactNumber,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const verifyUser = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) {
    throw new ApiError(400, "Code is required");
  }

  const user = await User.findOne({ email: req.user?.email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isCodeValid = user.verifyCode === code;
  const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();

  if (isCodeValid && !isCodeExpired) {
    user.isVerified = true;
    user.verifyCode = 0; // clear the code after verification
    user.verifyCodeExpiry = 0; // clear the expiry date after verification
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Account verified successfully"));
  } else if (isCodeExpired) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "Verification code has expired. Please sign up again to get a new code"
        )
      );
  } else {
    throw new ApiError(400, "Incorrect verification code");
  }
});

const resendOTP = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user?.email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const emailResponse = await sendVerificationEmail(
    user.email,
    `${user.firstName} ${user.lastName}`,
    user.verifyCode
  );

  if (!emailResponse.success) {
    throw new ApiError(
      500,
      emailResponse.message || "Failed to send verification email"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP resent successfully"));
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.verifyCode = otp;
  user.verifyCodeExpiry = Date.now() + 10 * 60 * 1000;

  await user.save();

  const emailResponse = await sendForgotPasswordEmail(
    user.email,
    `${user.firstName} ${user.lastName}`,
    otp
  );

  if (!emailResponse.success) {
    throw new ApiError(500, "Failed to send OTP email");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP sent successfully to your email"));
});

const resetPasswordWithOtp = asyncHandler(async (req, res) => {

    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      throw new ApiError(400, "Email, OTP, and new password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isOtpValid = user.verifyCode === otp;
    const isOtpExpired = Date.now() > user.verifyCodeExpiry;

    if (!isOtpValid || isOtpExpired) {
      throw new ApiError(400, "Invalid or expired OTP");
    }

    // OTP is valid and not expired, reset the password
    user.password = newPassword;
    user.verifyCode = 0;
    user.verifyCodeExpiry = 0;

    await user.save();


  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  verifyUser,
  resendOTP,
  forgetPassword,
  resetPasswordWithOtp,
};
