const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { User } = require("../models/user.model.js");
const Cart = require("../models/cart.model.js");

exports.addToCart = async(req,res) => {
    try { 
        const {isVenue, name, totalPrice, items} = req.body;
        if (
            [isVenue, name, totalPrice, items].some((field) => field?.trim() === "")
          ) {
            throw new ApiError(400, "All fields are required");
          }
        const cart = await Cart.create({
            isVenue, name, totalPrice, items
        });
        await cart.save();
        return res
        .status(200)
        .json(new ApiResponse(200, { data: cart }, "Added to cart successfully"));       
    } catch (error) {
        throw new ApiError(500, "Something went wrong", error.message);
    }
};

exports.removeFromCart = async(req,res) => {
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
}