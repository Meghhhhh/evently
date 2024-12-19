import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';

const EventCard = ({event}) => {
    const imageRef = useRef(null);
    
    const [imageName, setImageName] = useState("");
      const handleImageClick = () => {
          imageRef.current.click();
        };
      
        const handleImageChange = () => {
          const file = imageRef.current.files[0];
          if (file) {
            setImageName(file.name);
          }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
        
            const formData = new FormData();
            formData.append("eventImage", imageRef.current.files[0] || "");
            formData.append("regId",event._id);
        
            try {
              const response = await axios.post(
                "http://localhost:8080/api/v1/registration/addImageToEvent",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
        
              if (response.data.statusCode === 200) {
                toast.success("Image added sucesfully!");
              }
            } catch (error) {
              if (error.response && error.response.data) {
                const { message } = error.response.data;
                toast.error(message || "Failed to add city.");
              } else {
                toast.error("An unexpected error occurred.");
              }
            }
          };
        
        
  return (
    <div>
        <h2>{event.firstName} {event.lastName}</h2>
        <p>Event conducted on: {event.startDate}-{event.endDate}</p>
        <div>
        <div className="mb-4">
            <form onSubmit={handleSubmit}>
            <label htmlFor="image" className="block text-gray-300 mb-2">
              Add Image to event!
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
            <button
            type="submit"
            className="w-full p-3 bg-primaryPeach hover:bg-red-600 text-white font-semibold rounded-lg"
          >
            Add Image
          </button>
            </form>
          </div>

    </div>
    
    </div>
  )
}

export default EventCard