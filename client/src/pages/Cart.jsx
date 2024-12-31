import React, { useState, useEffect } from 'react';
import axios from 'axios';
import i1 from '../assets/images/download.jpeg';
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../features/user/userSlice.js";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null); // To handle error messages
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [userId2, setUserId2] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/users/current-user",
          { withCredentials: true }
        );

        const obj = response.data.data;
        console.log(obj);
        dispatch(
          setUserDetails({
            _id: obj._id,
            email: obj.email,
            firstName: obj.firstName,
            lastName: obj.lastName,
            userType: obj.userType,
            contactNumber: obj.contactNumber,
          })
        );

        // Set the userId2 state here
        setUserId2(obj._id);
      } catch (err) {
        toast.error("Error fetching user details!", {
          autoClose: 1500,
          closeButton: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [dispatch]);

  useEffect(() => {
    // Only fetch the cart if userId2 is not empty
    if (userId2) {
      const fetchCart = async () => {
        try {
          console.log("userid", userId2);
          const response = await axios.post(
            "http://localhost:8080/api/v1/cart/fetchCart",
            { userId: userId2 }
          );

          // Log the response data to inspect the structure
          //console.log("Response Data:", response.data);

          if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
            const cartData = response.data.data.data; // Access the correct nested array
            console.log(cartData);
            setCartItems(cartData);
            calculateTotalPrice(cartData);
          } else {
            setError("No cart items found or invalid data format.");
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
          setError("Error fetching cart items.");
        }
      };

      fetchCart();
      cartItems.forEach((item, index) => {
        console.log(`Package ${index + 1}:`, item.package);
      });
      
    }
  }, [userId2]);

  // Calculate the total price of all cart items
  const calculateTotalPrice = (items) => {
    if (Array.isArray(items)) {
      const total = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      setTotalPrice(total);
    } else {
      setError("Invalid data format for cart items.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-extrabold text-white mb-8 text-center">Your Cart</h1>

      {/* Error handling */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {cartItems.length === 0 ? (
        <p className="text-white text-center">Your cart is empty.</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index} className="bg-gray-800 shadow-lg rounded-lg p-6 mt-6 flex hover:bg-gray-700 transition duration-300">
            <div className="w-1/3">
              <img
                src={i1}
                alt={item.name}
                className="w-full h-auto rounded-lg object-cover transform hover:scale-105 transition duration-300"
              />
            </div>
            <div className="w-2/3 pl-6">
              <p className="text-xl font-bold text-blue-500">{item.name}</p>
              <p className="text-gray-400">Price: <span className="text-lg font-semibold text-mauve">${item.totalPrice}</span></p>
              <div className="text-gray-400 space-y-1">
                {/* Handling items field if available */}
                {item.items ? (
                  <div>
                  <div>Item Quantity: {item.items.itemQuantity}</div>
                  <div>Item Price: {item.items.itemPrice}</div>
                  </div>
                ):(
                  <div>nothing to show</div>
                )}


                
                {/* Handling package field if available */}
               {/* {item.package && Array.isArray(item.package) && item.package.length > 0 ? (
                  item.package.map((pkg, idx) => (
                    <p key={idx}>{pkg.packageName}: ${pkg.packagePrice}</p>
                  ))
                ) : (
                  <p>No package selected.</p>
                )}*/}
               {item.package ? (
  <div className='pt-3 space-y-2'>
    <span>Package name:</span>
    <div>
    {item.package.packageName?.map((pkgName, index) => (
      <div key={index} className=''>{pkgName}</div>
    ))}</div>
    <div>
      <div>Package Price: {item.package.packagePrice}</div>
      <div>Package Quantity:  {item.package.packageQuantity}</div>
    </div>
  </div>
) : (
  <div>No package available</div>
)}


                <p className="font-bold text-lg text-mauve">Total: ${item.totalPrice}</p>
              </div>
            </div>
          </div>
        ))
      )}

      <div className="mt-6 text-white font-bold">
        <p className="text-2xl">Total Price: ${totalPrice}</p>
      </div>
    </div>
  );
};

export default Cart;
