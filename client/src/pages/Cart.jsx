import React, { useState, useEffect } from 'react';
import axios from 'axios';
import i1 from '../assets/images/download.jpeg';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null); // To handle error messages
  
  const userId = "67647da0c8609ca55b145402";
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.post('http://localhost:8080/api/v1/cart/fetchCart', { userId });
        
        // Log the response data to inspect the structure
        console.log('Response Data:', response.data);
        
        if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
          const cartData = response.data.data.data; // Access the correct nested array
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
  }, [userId]);

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
              <p className="text-xl font-bold text-white">{item.name}</p>
              <p className="text-gray-400">Price: <span className="text-lg font-semibold text-mauve">${item.totalPrice}</span></p>
              <div className="text-gray-400 space-y-1">
                {/* Handling items field if available */}
                {item.items && Array.isArray(item.items) && item.items.length > 0 ? (
                  item.items.map((subItem, idx) => (
                    <p key={idx}>{subItem.itemName}: ${subItem.itemPrice}</p>
                  ))
                ) : (
                  <p>No items in this section.</p>
                )}

                {/* Handling package field if available */}
                {item.package && Array.isArray(item.package) && item.package.length > 0 ? (
                  item.package.map((pkg, idx) => (
                    <p key={idx}>{pkg.packageName}: ${pkg.packagePrice}</p>
                  ))
                ) : (
                  <p>No package selected.</p>
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
