import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const LocationCard = ({ modal, message, navigateTo, dispatchAction }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleBtnClick = () => {
    dispatch(dispatchAction(modal));
    navigate(navigateTo);
  };
  return (
    <div
      key={modal._id}
      className="bg-gray-700 rounded-lg shadow-lg overflow-hidden"
    >
      <img
        src={modal.venueImage || modal.cityImage}
        alt={modal.venueName || modal.cityName}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className=" text-lg font-bold mt-1 uppercase">
          {modal.venueName || modal.cityName}
        </h3>
        <h3 className=" text-sm font-bold uppercase">
        {modal.venueCity? modal.venueCity: null}
        </h3>
        <p className="text-gray-300 text-md">
          {modal.venueDescription || modal.cityDescription}
        </p>
      </div>
      <button className="w-full h-[50px] bg-red" onClick={handleBtnClick}>
        {message}
      </button>
    </div>
  );
};

export default LocationCard;
