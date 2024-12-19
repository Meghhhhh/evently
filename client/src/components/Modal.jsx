import React from "react";

const Modal = ({
  isOpen,
  handleExploreClick,
  city,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 backdrop-blur-sm"
    >
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className=" text-3xl font-bold text-black capitalize">{city.cityName}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            ✖
          </button>
        </div>
        <div>{children}</div>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 w-full bg-red text-white rounded hover:bg-reddark"
            onClick={() => {
              handleExploreClick(city);
              onClose();
            }}
          >
            Explore now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
