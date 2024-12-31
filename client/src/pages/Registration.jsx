import React, { useEffect, useState } from "react";
import GallerySlider from "../components/GallerySlider";
import i1 from "../assets/images/download.jpeg";
import i2 from "../assets/images/download (1).jpeg";
import i3 from "../assets/images/download (2).jpeg";
import i4 from "../assets/images/download (3).jpeg";
import ReviewSlider from "../components/ReviewSlider";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "../features/user/userSlice";
import axios from "axios";
import GallerySlider2 from "../components/GallerySlider2";
import { toast } from "react-toastify";

const Registration = () => {
  const [halls, setHalls] = useState([]);
  const [venue, setVenueData] = useState({});
  const [caterer, setCaterers] = useState([]);
  const [decorator, setDecorators] = useState([]);
  const [reviews, setReview] = useState([]);
  const { selectedVenue } = useSelector((state) => state.venue);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/users/current-user",
          { withCredentials: true }
        );

        const obj = response.data.data;
        console.log("User Details:", obj);
        dispatch(
          setUserDetails({
            _id: obj._id,
            email: obj.email,
            firstName: obj.firstName,
            lastName: obj.lastName,
            userType: obj.userType,
            contactNumber: obj.contactNumber,
          })
        );
      } catch (err) {
        toast.error("Error fetching user details!", {
          autoClose: 1500,
          closeButton: false,
        });
      }
    };

    fetchUserDetails();
  }, [dispatch]);

  useEffect(() => {
    const getReview = async () => {
      const response = await axios.post(
        `http://localhost:8080/api/v1/reviews/getReviewsByType`,
        { reviewType: "Venues" }
      );
      console.log(response);
      setReview(response?.data?.data?.data);
    };
    getReview();
  }, []);

  useEffect(() => {
    const getHalls = async () => {
      console.log(selectedVenue);

      const response = await axios.post(
        `http://localhost:8080/api/v1/venues/getAllSubVenuesAtVenue`,
        { venueId: selectedVenue._id }
      );
      console.log(response);

      setHalls(response?.data?.data?.data);
      console.log(halls);
    };
    getHalls();
  }, [selectedVenue]);

  useEffect(() => {
    const getVenueById = async () => {
      console.log(selectedVenue);

      const response = await axios.post(
        `http://localhost:8080/api/v1/venues/getVenueById`,
        { venueId: selectedVenue._id }
      );
      console.log(response);
      setVenueData(response?.data?.data?.data);
      console.log(venue);
    };
    getVenueById();
  }, [selectedVenue]);

  useEffect(() => {
    const getDecorators = async () => {
      console.log(selectedVenue);

      const response = await axios.post(
        `http://localhost:8080/api/v1/vendor/getAllByServiceType`,
        { venue: selectedVenue._id, vendorType: "decorator" }
      );
      console.log(response);
      setDecorators(response?.data?.data?.data);
    };
    getDecorators();
  }, [selectedVenue]);

  useEffect(() => {
    const getCaterers = async () => {
      console.log(selectedVenue);

      const response = await axios.post(
        `http://localhost:8080/api/v1/vendor/getAllByServiceType`,
        { venue: selectedVenue._id, vendorType: "caterer" }
      );
      console.log(response);
      setCaterers(response?.data?.data?.data);
    };
    getCaterers();
  }, [selectedVenue]);

  return (
    <div className="bg-black min-h-screen w-full pt-20">
      {/* Pass the dynamically fetched userId */}
      <GallerySlider
        slides={2}
        height={500}
        halls={halls}
        btn={"Add to cart"}
        userId={user._id} // Use the userId from Redux
      />
      <p className="text-offwhite text-6xl pb-2 px-10 font-bold">
        {selectedVenue.venueName}
      </p>
      <div className="bg-mauve w-[40%] h-[5px] mx-10 mb-10 rounded-full"></div>
      <div className="flex flex-col md:flex-row">
        <p className="text-grey px-10 my-10 w-[100%] text-xl">
          {selectedVenue.venueDescription}
        </p>
      </div>

      <p className="text-offwhite text-6xl text-center mt-20 font-semibold">
        Reviews from users conducting events here!
      </p>
      <ReviewSlider reviews={reviews} />

      <p className="text-offwhite text-6xl text-center mt-20 font-semibold">
        CATERER
      </p>
      <GallerySlider2 slides={3} height={300} halls={caterer} btn={"Explore Now"} />

      <p className="text-offwhite text-6xl text-center mt-20 font-semibold">
        DECORATOR
      </p>
      <GallerySlider2 slides={3} height={300} halls={decorator} btn={"Explore Now"} />
    </div>
  );
};

export default Registration;
