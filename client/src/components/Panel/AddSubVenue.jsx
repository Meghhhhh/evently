import axios from "axios";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { hourglass } from "ldrs";

hourglass.register();

const AddSubVenue = () => {
  const subVenueNameRef = useRef(null);
  const subVenuePriceRef = useRef(null);
  const subVenueDescriptionRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const [imageName, setImageName] = useState("");
  const [loader, setLoader] = useState(false);
  const { selectedVenue } = useSelector((state) => state.venue);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    const formData = new FormData();
    formData.append("subVenueName", subVenueNameRef.current.value || "");
    formData.append("subVenuePrice", subVenuePriceRef.current.value || "");
    formData.append("venueId", selectedVenue._id || "");
    formData.append(
      "subVenueDescription",
      subVenueDescriptionRef.current.value || ""
    );
    formData.append("image", imageRef.current.files[0] || "");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/venues/postSubVenueAtVenue",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.statusCode === 200) {
        toast.success("Sub Venue added successfully!");
        setTimeout(() => {
          navigate("/panel/venues");
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        toast.error(message || "Failed to add sub venue.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoader(false);
    }
  };

  const handleImageClick = () => {
    imageRef.current.click();
  };

  const handleImageChange = () => {
    const file = imageRef.current.files[0];
    if (file) {
      setImageName(file.name);
    }
  };

  return (
    <div className="h-screen py-[7%] overflow-scroll">
      <div className="bg-gray-900 p-8 rounded-lg max-w-lg mx-auto">
        <h2 className="text-center text-primaryPeach text-2xl font-bold text-red-400 mb-6">
          Add New Sub Venue
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="venueName" className="block text-gray-300 mb-2">
              Sub Venue Name:
            </label>
            <input
              type="text"
              id="subVenueName"
              ref={subVenueNameRef}
              placeholder="Enter sub venue name"
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-300"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="venuePrice" className="block text-gray-300 mb-2">
              Venue Price:
            </label>
            <input
              type="text"
              id="subVenuePrice"
              ref={subVenuePriceRef}
              placeholder="Enter sub venue price"
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-300"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="subVenueDescription"
              className="block text-gray-300 mb-2"
            >
              Sub Venue Description:
            </label>
            <textarea
              id="subVenueDescription"
              ref={subVenueDescriptionRef}
              placeholder="Enter sub venue description"
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 h-32"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-300 mb-2">
              Sub Venue Image:
            </label>
            {/* Hidden file input */}
            <input
              type="file"
              id="image"
              ref={imageRef}
              accept="image/*"
              className="hidden" // Hide the default file input
              onChange={handleImageChange} // Handle file input change
            />
            {/* Custom file input button */}
            <button
              type="button"
              onClick={handleImageClick}
              className="w-auto p-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
            >
              Choose Image
            </button>
            {/* Display the selected image name */}
            {imageName && (
              <span className="ml-4 text-gray-300">{imageName}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-primaryPeach hover:bg-red-600 text-white font-semibold rounded-lg h-[60px] text-lg"
          >
            {loader ? (
              <l-hourglass
                size="30"
                bg-opacity="0.1"
                speed="1.75"
                color="black"
              ></l-hourglass>
            ) : (
              "Add Sub Venue"
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddSubVenue;
