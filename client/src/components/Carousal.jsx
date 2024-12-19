import React, { useState, useEffect } from "react";

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
            className="w-full flex-shrink-0 relative group"
            style={{
              backgroundImage: `url(${image.eventImages[0]})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              height: "400px",
            }}
          >
            <div
              className="absolute inset-0 flex flex-col justify-center items-center text-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
              style={{
                background: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(5px)",
              }}
            >
              <h3 className="text-lg font-bold">{image.eventType}</h3>
              <h3 className="text-md font-bold">
                {image.venue.venueName}, {image.venue.venueCity}
              </h3>
              <h3 className="text-sm font-bold">
                {image.vendors.map(
                  (vendor) =>
                    `${vendor.vendorId.serviceName} - ${vendor.packageId.packageName}`
                ).join(", ")}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
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
