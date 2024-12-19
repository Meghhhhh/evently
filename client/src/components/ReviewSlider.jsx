
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';

import { FaStar } from "react-icons/fa";
import ReactStars from "react-rating-stars-component";
import axios from 'axios'


  // const reviews = [
  //   {
  //     user: "Priyal Rawal",
  //     rating: 4,
  //     review: "Great event!",
  //     image: i1
  //   },
  //   {
  //     user: "Riddhi Thakkar",
  //     rating: 4,
  //     review: "Great event!",
  //     image: i2
  //   },
  //   {
  //     user: "Shubh DOshi",
  //     rating: 4,
  //     review: "Great event!",
  //     image: i3
  //   },
  //   {
  //     user: "Megh Prajapati",
  //     rating: 4,
  //     review: "Great event!",
  //     image: i4
  //   },

  //   {
  //     user: "Priyal Rawal",
  //     rating: 4,
  //     review: "Great event!",
  //     image: i1
  //   },
  //   {
  //     user: "Riddhi Thakkar",
  //     rating: 4,
  //     review: "Great event!",
  //     image: i2
  //   },
  //   {
  //     user: "Shubh DOshi",
  //     rating: 4,
  //     review: "Great event!",
  //     image: i3
  //   },
  //   {
  //     user: "Megh Prajapati",
  //     rating: 4,
  //     review: "Great event!",
  //     image: i4
  //   },
    
  // ];



  function ReviewSlider({ reviews }) {
  const truncateWords = 20; 

  return (
    <div className="text-white">
      <div className="my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          navigation={true}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full"
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-offwhite border-2 rounded-md">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review.image
                        ? review.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review.userId.firstName}`
                    }
                    alt={review.user}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">

                    <h1 className="font-semibold text-richblack-5">
                      {review.userId.firstName} {review.userId.lastName}
                    </h1>
                  </div>
                </div>
                <p className="font-medium text-richblack-25">
                  {review.review.split(" ").length > truncateWords
                    ? `${review.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")} ...`
                    : review.review}
                </p>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-yellow-100">
                    {review.rating.toFixed(1)}
                  </h3>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
          {/* <SwiperSlide>Slide 1</SwiperSlide> */}
        </Swiper>
      </div>
    </div>
  );
}


export default ReviewSlider;
