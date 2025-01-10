const { ApiError } = require('../utils/ApiError.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model.js');

// const verifyJWT = asyncHandler(async (req, res, next) => {

//   console.log("inside verifyJWT" + req.cookies);
//   try {
//     console.log("token : " + token + "Cookies : " + req.cookies);
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");

//     console.log("token : " + token + "Cookies : " + req.cookies);
//     if (!token) {
//       throw new ApiError(401, "Unauthorized request");
//     }

//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     const user = await User.findById(decodedToken?._id).select(
//       "-password -refreshToken"
//     );

//     if (!user) {
//       throw new ApiError(401, "Invalid Access Token");
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log("token : " + token + "Cookies : " + req.cookies);
//     throw new ApiError(401, error?.message || "Invalid access token");
//   }
// });

const verifyJWT = async (req, res, next) => {
  try {
    // console.log('Cookies:', JSON.stringify(req.cookies));
    console.log('Request body:', JSON.stringify(req.body));
    // console.log('Inside verifyJWT');
    
    let token = req.cookies?.accessToken || req.body.accessToken;
    console.log(token)
    // if (typeof token === 'object') {
    //   token = JSON.stringify(token); // If it's an object, convert it to a string
    // }
  
    // If no cookie, check Authorization header
    if (!token) {
      const authHeader = req.header('Authorization');
  
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
  
    if (!token) {
      throw new ApiError(401, 'Unauthorized request - No token provided');
    }
  
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken',
    );
  
    if (!user) {
      throw new ApiError(401, 'Invalid Access Token - User not found');
    }
  
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
};
module.exports = { verifyJWT };
