import React, { useEffect, useState } from "react";
import { LocationCard } from "../index.js";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { setSelectedCity } from "../../features/city/citySlice.js";
import { useNavigate } from "react-router-dom";

const Cities = () => {
  const [cities, setCities] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const getCities = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/cities/getAllCitiesExceptSelected"
        );
        if (response?.data?.statusCode <= 200) {
          setCities(response.data.data?.data);
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };
    getCities();
  }, []);

  return (
    <div className="h-screen overflow-scroll p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Cities</h2>

      <div className="flex justify-center mb-6">
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cities.length !== 0 ? (
          cities.map((city) => (
            <LocationCard
              key={city._id}
              modal={city}
              message={"Add Venue"}
              navigateTo={"/panel/add-venue"} 
              dispatchAction={setSelectedCity}
            />
          ))
        ) : (
          <div className="flex flex-col items-center text-center p-6 w-screen">
            <FaMapMarkerAlt className="text-6xl text-gray-400 mb-4" />
            <h1 className="text-2xl font-semibold uppercase">
              No cities available at the moment...
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cities;
