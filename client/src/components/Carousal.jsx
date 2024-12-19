import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const Carousal = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="z-10 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0"
            style={{
              backgroundImage: `url(${image.eventImages[0]})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              height: "400px",
            }}
          >
            <div className="absolute bottom-0 text-white bg-black bg-opacity-30">
              <h3 className="text-sm font-bold">{image.eventType}</h3>
              <h3 className="text-sm font-bold">
                {image.venue.venueName},{image.venue.venueCity}
              </h3>
              <h3 className="text-sm font-bold ove">
                {image.vendors.map(
                  (vendor) =>
                    `${vendor.vendorId.serviceName} - ${vendor.packageId.packageName}, `
                )}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Dots*/}
      <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-500"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousal;
