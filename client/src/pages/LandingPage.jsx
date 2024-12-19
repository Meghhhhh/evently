import React, { useEffect, useState } from "react";
import image from "../assets/landing.jpg";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCity } from "../features/city/citySlice"; 

const LandingPage = ({ setIsVisible }) => {
  const [cities, setCities] = useState([]);
  const selectedCity = useSelector((state) => state.city.selectedCity);
  const dispatch = useDispatch(); // For dispatching actions

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/cities/getAllCitiesExceptSelected"
        );
        setCities(response?.data?.data?.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const handleCityChange = (e) => {
    const selectedCityId = e.target.value;
    const selectedCity = cities.find(city => city._id === selectedCityId);
    dispatch(setSelectedCity(selectedCity));
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <section className="relative w-full h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${image})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="relative flex flex-col items-center justify-center h-full p-6 z-10">
          <header className="w-full text-center py-8">
            <h1 className="text-4xl xs:text-2xl font-bold">
              Event Planning and Management Web App
            </h1>
            <p className="text-xl xs:text-base mt-4">
              Simplifying Your Event Planning Experience
            </p>
          </header>
          <h2 className="text-3xl xs:text-xl font-semibold mb-6">
            Select Your City
          </h2>
          <select
            className="w-2/3 p-3 border border-gray-300 rounded-lg shadow-sm text-lg xs:text-base outline-none bg-black/20"
            value={selectedCity?._id || ""}
            onChange={handleCityChange}
          >
            <option value="">Choose a City</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.cityName}
              </option>
            ))}
          </select>
          <button
            className="bg-[#FF5364] hover:bg-[#FF5364]/80 px-8 py-4 rounded-lg text-xl xs:text-base mt-6 text-white"
            onClick={() => setIsVisible(false)}
          >
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
