import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Payment = () => {
  const [dummyProducts, setDummyProducts] = useState([]);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.user._id); // Fetch userId directly from Redux store

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/cart/fetchCart",
          { userId }
        );

        console.log("Response Data:", response.data);

        if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
          const cartData = response.data.data.data.map((item) => ({
            name: item.name || "Unknown Product",
            image: item.productImage || "https://via.placeholder.com/150",
            price: (item.totalPrice || 0) * 1, // Convert price to cents
            quantity: item.productQuantity || 1,
          }));

          setDummyProducts(cartData);
          console.log("Transformed Cart Data:", response.data.data.data);
        } else {
          setError("No cart items found or invalid data format.");
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError("Error fetching cart items.");
      }
    };

    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const makePayment = async () => {
    if (!dummyProducts.length) {
      toast.error("Your cart is empty.");
      return;
    }

    const stripe = await loadStripe(
      "pk_test_51PWtVZDuAWgKsNtLWlTBbBMPiEHIo9hs4ChscB7WaDf8MwCaKradFm0r7TE5gfT4r1AlVEvbI13RsmeM0ECu6RBA004zi06fDH"
    );

    const body = { products: dummyProducts };
    const headers = { "Content-Type": "application/json" };

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/registration/payment",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        }
      );

      const session = await response.json();
      console.log("Session Data:", session);

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error("Stripe Error:", result.error);
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Error initiating payment. Please try again.");
    }
  };

  return (
    <button
      className="min-w-1/12 h-[50px] bg-red px-4 rounded-md mt-2"
      onClick={makePayment}
      type="button"
      disabled={dummyProducts.length === 0 || error !== null}
    >
      Checkout
    </button>
  );
};

export default Payment;
