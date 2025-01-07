import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/registration/getUserEvents`,
          {
            withCredentials: true,
          },
        );
        console.log(response.data.data);
        setEvents(response.data.data);
      } catch (error) {
        console.error('Error fetching events:', error.message);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="w-full min-h-[100%] flex items-center justify-center flex-col p-8">
      <h1 className="text-3xl font-bold mb-6">Event History</h1>
      <div className="flex flex-col gap-6 w-11/12">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-[#FF5364]/80 shadow-lg rounded-lg overflow-hidden flex flex-row max-[990px]:flex-col justify-center items-center w-full"
          >
            {event.eventImages && event.eventImages.length > 0 && (
              <img
                src={event.eventImages[0]}
                alt="Event"
                className="w-2/5 max-[990px]:w-full p-2 max-[990px]:p-0 h-64 object-contain"
              />
            )}
            <div className="w-3/5 max-[990px]:w-full p-4">
              <h2 className="text-xl font-semibold mb-2">
                {event.firstName} {event.lastName}
              </h2>
              <p>
                {new Date(event.startDate).toLocaleDateString()} -{' '}
                {new Date(event.endDate).toLocaleDateString()}
              </p>
              <p
                className={`text-sm ${
                  event.hasHappened ? 'text-green-500' : 'text-blue-500'
                }`}
              >
                {event.hasHappened ? 'Event Completed' : 'Upcoming Event'}
              </p>
              <p className="mt-2">Cost: ${event.cost}</p>
              <div className="mt-4">
                <h3 className="text-lg font-medium">Services:</h3>
                <ul className="list-disc list-inside">
                  {event.vendors.map((vendor, i) => (
                    <li key={i}>
                      {vendor.vendorId.vendorType}:{' '}
                      {vendor.vendorId.serviceName || 'N/A'}
                    </li>
                  ))}
                  <li>Venue: {event.venue?.venueName || 'N/A'}</li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
