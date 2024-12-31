import React, { useState, useEffect } from 'react';
import axios from 'axios';
import i1 from '../assets/images/download.jpeg';
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../features/user/userSlice.js";
import Payment from "../components/Payment.jsx"
import { toast } from "react-toastify";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/users/current-user",
          { withCredentials: true }
        );

        const user = response.data.data;
        dispatch(setUserDetails(user));
        setUserId(user._id);
      } catch (err) {
        toast.error("Error fetching user details!");
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      const fetchCart = async () => {
        try {
          const response = await axios.post(
            "http://localhost:8080/api/v1/cart/fetchCart",
            { userId }
          );

          const cartData = response.data.data.data || [];
          setCartItems(cartData);
          calculateTotalPrice(cartData);
        } catch (error) {
          setError("Error fetching cart items.");
        }
      };

      fetchCart();
    }
  }, [userId]);

  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    setTotalPrice(total);
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/cart/removeFromCart",
        { id: itemId }
      );

      if (response.data.success) {
        toast.success("Item removed from cart!");
        const updatedCart = cartItems.filter((item) => item._id !== itemId);
        setCartItems(updatedCart);
        calculateTotalPrice(updatedCart);
      } else {
        toast.error("Failed to remove item from cart.");
      }
    } catch (error) {
      toast.error("Error removing item from cart.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-extrabold text-white mb-8 text-center">Your Cart</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {loading ? (
        <p className="text-white text-center">Loading...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-white text-center">Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item._id} className="bg-gray-800 shadow-lg rounded-lg p-6 mt-6 flex hover:bg-gray-700 transition duration-300">
            <div className="w-1/3">
              <img
                src={i1}
                alt={item.name}
                className="w-full h-auto rounded-lg object-cover transform hover:scale-105 transition duration-300"
              />
            </div>
            <div className="w-2/3 pl-6">
              <p className="text-xl font-bold text-white">{item.name}</p>
              <p className="text-gray-400">Price: <span className="text-lg font-semibold text-mauve">${item.totalPrice}</span></p>

              {item.items?.length > 0 && item.items.map((subItem, idx) => (
                <p key={idx}>{subItem.itemName}: ${subItem.itemPrice}</p>
              ))}

              {item.package?.length > 0 && item.package.map((pkg, idx) => (
                <p key={idx}>{pkg.packageName}: ${pkg.packagePrice}</p>
              ))}

              <p className="font-bold text-lg text-mauve">Total: ${item.totalPrice}</p>
              <button
                onClick={() => handleDelete(item._id)}
                className="min-w-1/12 h-[50px] bg-red px-4 rounded-md text-white"
              >
                Delete from cart
              </button>
            </div>
          </div>
        ))
      )}

      <div className="mt-6 text-white font-bold">
        <p className="text-2xl">Total Price: ${totalPrice}</p>
        <Payment />
      </div>
    </div>
  );
};

export default Cart;
