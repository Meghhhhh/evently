import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Autoplay, Navigation } from "swiper/modules";
import axios from "axios";

const GallerySlider = ({ slides = 3, height = 300, halls = [], btn = "Book Now", userId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Render a placeholder message if no valid `halls` data is provided
  if (!Array.isArray(halls) || halls.length === 0) {
    return (
      <div className="flex justify-center items-center h-[200px] bg-gray-200 rounded-lg text-gray-700 text-lg font-semibold">
        No halls available to display.
      </div>
    );
  }

  // Function to handle adding the venue to the cart
  const addVenueToCart = async (hall) => {
    try {
      setLoading(true);
      setError(null);
  
      // Check that required fields are available
      if (!hall.subVenueName || !hall.subVenuePrice) {
        setError("Incomplete hall information. Please check the details.");
        return;
      }

      const response = await axios.post('http://localhost:8080/api/v1/cart/addToCart', {
        userId,
        isVenue: true,
        name: hall.subVenueName,
        totalPrice: hall.subVenuePrice,
        items: [{
        itemQuantity: 1,
        itemPrice: hall.subVenuePrice
        }],
        package: [{
          packageName:"Pack",
          packageQuantity:1,
          packagePrice: hall.subVenuePrice
        }] // Replace with actual package data if available
      });
  
      // Handle success (show a message, update the UI, etc.)
      alert("Venue added to cart successfully!");
    } catch (error) {
      setError("Failed to add venue to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Swiper
      spaceBetween={10}
      loop={true}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      navigation={true}
      modules={[Autoplay, Navigation]}
      breakpoints={{
        320: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: slides,
        },
      }}
      style={{ padding: "20px" }}
    >
      {halls.map((hall, index) => (
        <SwiperSlide key={index}>
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={hall?.subVenueImage || "placeholder-image-url.jpg"}
              alt={`Slide ${index}`}
              className="w-full h-auto object-cover transition-transform duration-300 ease-in-out"
              style={{ height: `${height}px`, borderRadius: "8px" }}
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out">
              <h2 className="text-white text-2xl font-bold mb-2">
                {hall?.subVenueName || "Unnamed Hall"}
              </h2>
              <p className="text-white text-lg mb-2">
                {hall?.subVenueDescription || "Description not available."}
              </p>
              <p className="text-white text-xl mb-4">
                Price: ${hall?.subVenuePrice || "N/A"}
              </p>
              <button
                className="bg-mauve text-white px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300"
                onClick={() => addVenueToCart(hall)}
                disabled={loading}
              >
                {loading ? "Adding..." : btn}
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
      {error && (
        <div className="text-red-500 text-center mt-4">
          {error}
        </div>
      )}
    </Swiper>
  );
};

export default GallerySlider;
