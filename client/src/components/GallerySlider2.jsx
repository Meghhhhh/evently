import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Autoplay, Navigation } from "swiper/modules";
import {useNavigate } from 'react-router-dom'

const GallerySlider = ({ slides, height, halls, btn }) => {
  const Navigate = useNavigate();

  return (
    <Swiper
      spaceBetween={10}
      loop={true}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      navigation={true}
      modules={[Autoplay, Navigation]}
      breakpoints={{
        320: {
          slidesPerView: 1, 
        },
        640: {
          slidesPerView: 2, 
        },
        1024: {
          slidesPerView: slides, 
        },
      }}
      style={{ padding: "20px" }}
    >
      {halls.map((hall, index) => (
        <SwiperSlide key={index}>
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={hall.subVenueImage}
              alt={`Slide ${index}`}
              className="w-full h-auto object-cover transition-transform duration-300 ease-in-out"
              style={{ height: `${height}px`, borderRadius: "8px" }}
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out">
              <h2 className="text-white text-2xl font-bold mb-2">{hall.serviceName}</h2>
              <p className="text-white text-lg mb-2">{hall.about}</p>
              <button className="bg-mauve text-white px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300" onClick={() => Navigate(`/vendor/${hall._id}`)}>
                {btn}
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default GallerySlider;
