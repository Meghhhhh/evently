const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { ApiError } = require("../utils/ApiError.js");
const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("../config/firebase.config.js");
const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
 // deleteObject,
} = require("firebase/storage");
const { Venues } = require("../models/venues.model.js");

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// const getAllVenueAtCityNew = asyncHandler(async(req,res)=>{
//   console.log('Route hit');
// try {
//   console.log("bsdkaslf")
//   const {venueCity} = req.query;
//   console.log("city name fetched");
//   if(!venueCity){
//     return res.status(400).json(new ApiResponse(400,null,"First select the city"));
//   }
//   const allVenues = await Venues.find({ venueCity: venueCity });
//   return res.status(200).json(new ApiResponse(200,{data: allVenues},"Fetched all the venue"));

// } catch (error) {
//   return res.status(error.statusCode || 500).json(new ApiResponse(500,null,"not Fetched all the venue"));
// }
// });

const getAllSubVenuesAtVenue = asyncHandler(async (req, res) => {
  try {
    const { venueId } = req.body;
    const venue = await Venues.findById(venueId);
    if (!venue) throw new ApiError(404, "No venue found");
    if (venue.subVenues.length === 0)
      return res
        .status(200)
        .json(new ApiResponse(200, null, "No Sub Venues at the provided venue"));
    return res
      .status(200)
      .json(new ApiResponse(200, { data: venue.subVenues }, "Sub Venues found"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
});


const getVenueById = asyncHandler(async(req,res) => {
  try {
    const venue = await Venues.findById(req.body.venueId);
    if(!venue) throw new ApiError(404, "No venue found");
    return res
      .status(200)
      .json(new ApiResponse(200, { data: venue }, "Venue found"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
})

const postSubVenueAtVenue = asyncHandler(async (req, res) => {
  const { venueId, subVenueName, subVenueDescription, subVenuePrice } =
    req.body;
  const file = req.file;

  if (!venueId || !file) {
    throw new ApiError(400, "All venue details are required");
  }

  const venue = await Venues.findById(venueId);
  if (!venue) throw new ApiError(404, "No venue found");

  try {
    const fileName = `${Date.now()}_${file.originalname}`;
    const storageRef = ref(storage, `images/${fileName}`);
    const metadata = { contentType: file.mimetype };
    const uploadTask = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );
    const downloadURL = await getDownloadURL(uploadTask.ref);
    const subVenueTemp = {
      subVenueName,
      subVenueDescription,
      subVenuePrice,
      subVenueImage: downloadURL,
      subVenueImageName: fileName,
    };
    venue.subVenues.push(subVenueTemp);
    await venue.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: venue },
          "Sub Venue added to venue successfully"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

module.exports = { getAllSubVenuesAtVenue, postSubVenueAtVenue, getVenueById };
