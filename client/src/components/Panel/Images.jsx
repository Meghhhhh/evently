import React, { useEffect, useState } from "react";
import { LocationCard } from "../index.js";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { setSelectedCity } from "../../features/city/citySlice.js";
import { useNavigate } from "react-router-dom";
import EventCard from "../EventCard"

const Images = () => {
    const [images, setImages] = useState([]);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate(); 
    useEffect(() => {
        const getEvents = async () => {
          try {
            console.log("use-effect")
            const response = await axios.get(
              "http://localhost:8080/api/v1/registration/recentEvents"
            );
              console.log(response)
              setEvents(response.data.data.data);
              console.log(events);
          } catch (error) {
            console.error("Failed to fetch events:", error);
          }
        };
        getEvents();
      }, []);
    
  return (
    <div className="h-screen overflow-scroll p-4">
    <h2 className="text-3xl font-bold mb-6 text-center text-white">Events</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {events.length !== 0 ? (
        events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
          />
        ))
      ) : (
        <div className="flex flex-col items-center text-center p-6 w-screen">
          <FaMapMarkerAlt className="text-6xl text-gray-400 mb-4" />
          <h1 className="text-2xl font-semibold uppercase">
            No events available at the moment...
          </h1>
        </div>
      )}
    </div>
  </div>
  )
}

export default Images