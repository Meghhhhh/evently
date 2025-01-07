import React from "react";

const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  return (
    <div key={review.id} className=" rounded-lg shadow-lg p-4 ">
      <h3 className="text-xl font-bold mb-2 ">{review.userId.firstName} {review.userId.lastName}</h3>
      <p className="text-yellow-400 ">
        Rating: {renderStars(review.rating)} ({review.rating}/5)
      </p>
      <p className=" mt-2">{review.review}</p>
    </div>
  );
};

export default ReviewCard;
