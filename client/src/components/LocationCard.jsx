import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedVenue } from "../features/venue/venueSlice.js";

const LocationCard = ({ modal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleBtnClick = () => {
    dispatch(setSelectedVenue(modal._id))
    navigate("/registration");
  }
  return (
    <div
      key={modal._id}
      className="bg-gray-700 rounded-lg shadow-lg overflow-hidden"
    >
      <img
        src={modal.venueImage}
        alt={modal.venueName}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className=" text-lg font-bold mt-1 uppercase">{modal.venueName}</h3>
        <p className="text-gray-300 text-md">{modal.venueDescription}</p>
        <p className="text-gray-300 text-xl mt-3">₹</p>
      </div>
      <button className="w-full h-[50px] bg-red" onClick={handleBtnClick}>See Location</button>
    </div>
  );
};

export default LocationCard;
