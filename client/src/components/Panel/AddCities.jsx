import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { hourglass } from "ldrs";

hourglass.register();

const AddCities = () => {
  const cityNameRef = useRef(null);
  const cityDescriptionRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const [imageName, setImageName] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    const formData = new FormData();
    formData.append("cityName", cityNameRef.current.value || "");
    formData.append("cityDescription", cityDescriptionRef.current.value || "");
    formData.append("image", imageRef.current.files[0] || "");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/cities/postCity",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.statusCode === 200) {
        toast.success("City added successfully!");
        setTimeout(() => {
          navigate("/panel/cities");
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        toast.error(message || "Failed to add city.");
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
          Add New City
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="cityName" className="block text-gray-300 mb-2">
              City Name:
            </label>
            <input
              type="text"
              id="cityName"
              ref={cityNameRef}
              placeholder="Enter city name"
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-300"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="cityDescription"
              className="block text-gray-300 mb-2"
            >
              City Description:
            </label>
            <textarea
              id="subVenueDescription"
              ref={cityDescriptionRef}
              placeholder="Enter city description"
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 h-32"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-300 mb-2">
              City Image:
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
              "Add City"
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddCities;
