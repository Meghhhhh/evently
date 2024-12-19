const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const Cart = require("../models/cart.model.js");
 
exports.addToCart = async (req, res) => {
  try {
    const { userId, isVenue, name, totalPrice, items, package } = req.body;
    console.log(req.body);

    // Validate required fields
    if (
      [userId, name, totalPrice, items, package].some((field) => !field || (Array.isArray(field) && field.length === 0))
    ) {
      throw new ApiError(400, "All fields are required");
    }

    // Check if cart already exists for the user
    let cart = await Cart.findOne({ userId });
    if (cart) {
      // If a cart exists, we update it
      cart.isVenue = isVenue;
      cart.name = name;
      cart.totalPrice = totalPrice;
      cart.items = items;
      cart.package = package;
      await cart.save();
      return res.status(200).json(new ApiResponse(200, { data: cart }, "Cart updated successfully"));
    } else {
      // If no cart exists for the user, create a new one
      cart = await Cart.create({
        userId,
        isVenue,
        name,
        totalPrice,
        items,
        package,
      });
      await cart.save();
      return res.status(200).json(new ApiResponse(200, { data: cart }, "Added to cart successfully"));
    }
  } catch (error) {
    throw new ApiError(500, "Something went wrong", error.message);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    if (!req.body.id) {
      throw new ApiError(400, "Cart ID is required");
    }

    const cart = await Cart.findById(req.body.id);
    if (!cart) {
      throw new ApiError(404, "Cart element not found");
    }

    await Cart.findByIdAndDelete(req.body.id);

    return res
      .status(200)
      .json(new ApiResponse(200, { data: cart }, "Removed from cart successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong", error.message);
  }
};

exports.fetchCart = async (req, res) => {
  try {
    const { userId } = req.body; // Assuming userId is sent in the request body

    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    // Fetch the cart items for the given userId
    const cartItems = await Cart.find({ userId });

    if (!cartItems || cartItems.length === 0) {
      throw new ApiError(404, "No items found in the cart");
    }

    return res.status(200).json(new ApiResponse(200, { data: cartItems }, "Fetched cart items successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong", error.message);
  }
};

exports.fetchCartTotalPrice = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    const cartItems = await Cart.find({ userId });

    if (!cartItems || cartItems.length === 0) {
      throw new ApiError(404, "No items found in the cart");
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    return res.status(200).json(new ApiResponse(200, { totalPrice }, "Total price calculated successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong", error.message);
  }
};
