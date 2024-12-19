import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { FaCity, FaMapMarkerAlt, FaCommentDots } from "react-icons/fa";
import { setVenues, setSelectedVenue } from "../features/venue/venueSlice.js";
import { setSelectedCity } from "../features/city/citySlice.js";
import {
  Navbar,
  Modal,
  ModalButton,
  LocationCard,
  Footer,
  Carousal,
  Sidebar,
} from "../components/index.js";
import ReviewSlider from "../components/ReviewSlider.jsx";

// Define custom styles for headings
const customStyles = `
  .heading-container {
    position: relative;
    display: inline-block;
  }
  .heading-container::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 100%;
    height: 5px;
    border-radius: 10px;
    background-color: #6b21a8; /* Change this color to fit your theme */
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.3s ease;
  }
  .heading-container:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;

const Home = () => {
  const dispatch = useDispatch();

  const { venues } = useSelector((state) => state.venue);
  const { selectedCity } = useSelector((state) => state.city);

  const [cities, setCities] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [openModals, setOpenModals] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [images, setImages] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const getCities = async () => {
      const response = await axios.post(
        "http://localhost:8080/api/v1/cities/getAllCitiesExceptSelected",
        { excludedCity: selectedCity?.cityName ? selectedCity.cityName : "City1111" }
      );
      if (response.data.statusCode <= 200)
        setCities(response?.data?.data?.data);
    };

    getCities();
  }, [selectedCity]);

  useEffect(() => {
    const getReviews = async () => {
      const response = await axios.post(
        "http://localhost:8080/api/v1/reviews/getReviewsByType"
      );
      if (response?.data?.statusCode <= 200) {
        setReviews(response.data.data?.data);
      }
    };
    getReviews();
  }, []);

  useEffect(() => {
    const getVenues = async () => {
      const response = await axios.post(
        "http://localhost:8080/api/v1/cities/getAllVenuesAtCity",
        { cityName: selectedCity.cityName ? selectedCity.cityName : "City1111" }
      );
      if (response?.data?.statusCode <= 200) {
        dispatch(setVenues(response.data.data.data))
      }
    };
    getVenues();
  }, [selectedCity]);

  useEffect(() => {
    const getImages = async() => {
      const response = await axios.get("http://localhost:8080/api/v1/registration/recentEventImages");

      if (response.data.statusCode <= 200)
        setImages(response?.data?.data?.data);
    }
    getImages();
  }, [])

  const openModal = (modalId) => {
    setOpenModals({ ...openModals, [modalId]: true });
  };

  const closeModal = (modalId) => {
    setOpenModals({ ...openModals, [modalId]: false });
  };

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleExploreClick = (city) => {
    dispatch(setSelectedCity(city));
  };
 
  return (
    <div className="min-h-screen">
      <style>{customStyles}</style> {/* Inline styles for headings */}

      <Navbar onSidebarToggle={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      {/* Modals for diff cities */}
      <div className="flex items-center justify-center py-6 pt-20 relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 z-10 bg-gray-600 text-white p-2 rounded-full text-2xl font-bold hover:bg-gray-500 transition-colors"
        >
          &lt;
        </button>
        <div
          ref={containerRef}
          className="flex gap-4 p-4 overflow-x-auto hide-scrollbar"
          style={{ maxHeight: "200px", whiteSpace: "nowrap" }}
        >
          {cities.length !== 0 ? (
            cities.map((city) => (
              <ModalButton
                key={city._id}
                modal={city}
                onClick={() => openModal(city._id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center text-center p-6">
              <FaCity className="text-6xl text-gray-400 mb-4" />
              <h1 className="text-xl font-semibold uppercase">
                No cities to display currently
              </h1>
            </div>
          )}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 bg-gray-600 text-white p-2 rounded-full text-2xl font-bold hover:bg-gray-500 transition-colors"
        >
          &gt;
        </button>

        {cities.map((city) => (
          <Modal
            key={city._id}
            isOpen={openModals[city._id]}
            onClose={() => closeModal(city._id)}
            city={city}
            handleExploreClick={handleExploreClick}
          >
            <img
              src={city.cityImage}
              alt={city.cityName}
              className=" min-w-90 min-h"
            />
            <p className="text-black mt-2">{city.cityDescription}</p>
          </Modal>
        ))}
      </div>

      {/* images carousal */}
      <div className="py-8">
        <h2 className="text-3xl font-bold mb-6 text-center heading-container ml-3 uppercase">
          Recent Events
        </h2>
        <Carousal images={images} />
      </div>

      {/* exploring locations */}
      <div className="py-8 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center heading-container uppercase">
          {`Explore locations at ${selectedCity.cityName}`}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {venues.length !== 0 ? (
            venues.map((venue) => (
              <LocationCard
                key={venue._id}
                modal={venue}
                message={"See Location"}
                navigateTo={"/dateSelector"}
                dispatchAction={setSelectedVenue}
              />
            ))
          ) : (
            <div className="flex flex-col items-center text-center p-6 w-screen">
              <FaMapMarkerAlt className="text-6xl text-gray-400 mb-4" />
              <h1 className="text-2xl font-semibold uppercase">
                No venues available at the city...
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* reviews */}
      <div className="pt-5 px-4 bg-gray-900">
        <h2 className="text-3xl font-bold mb-6 text-center heading-container uppercase">
          Latest Reviews
        </h2>
          {reviews.length !== 0 ? (
            <ReviewSlider reviews={reviews} /> 
          ) : (
            <div className="flex flex-col items-center p-6 w-screen ">
            <FaCommentDots className="text-6xl text-gray-400 mb-4" />
            <h1 className="text-2xl font-semibold uppercase text-white">
              No reviews to display
            </h1>
          </div>
          )}
      </div>

      {/* footer */}
      <Footer />
    </div>
  );
};

export default Home;
