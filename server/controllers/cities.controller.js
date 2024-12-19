const { Cities } = require("../models/cities.model.js");
const { Venues } = require("../models/venues.model.js");
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
  deleteObject,
} = require("firebase/storage");

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const getAllCitiesExceptSelected = asyncHandler(async (req, res) => {
  try {
    let cities;
    if (req.body.excludedCity) {
      cities = await Cities.find({
        cityName: { $ne: req.body.excludedCity },
      });
    } else {
      cities = await Cities.find();
    }

    if (cities.length === 0) {
      throw new ApiError(404, "No cities found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { data: cities }, "Cities found"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});
const getAllCities = asyncHandler(async(req,res)=>{
  try {
    const allCities = await Cities.find();
    return res.status(200).json(new ApiResponse(200,{data: allCities},"Fetched all the cities"));
  } catch (error) {
    return res.status(error.statusCode || 500).json(new ApiResponse(500,null,"not Fetched all the cities"));
  }
});
const getCityById = asyncHandler(async (req, res) => {
  try {
    if (!req.body.id) {
      throw new ApiError(400, "City ID is required");
    }

    const city = await Cities.findById(req.body.id);

    if (!city) {
      throw new ApiError(404, "City not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { data: city }, "City found"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const getAllVenuesAtCity = asyncHandler(async (req, res) => {
  try {

    const { cityName } = req.body;
console.log(cityName);
    if (!cityName) {
      throw new ApiError(400, "City name is required");
    }

    const city = await Cities.findOne({ cityName }).populate("venuesAtCity");

    if (!city) {
      throw new ApiError(404, "City not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: city.venuesAtCity },
          "Venues found at city"
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const postCity = asyncHandler(async (req, res) => {
  const { cityName, cityDescription } = req.body;
  const file = req.file;

  if (!cityName || !cityDescription || !file) {
    throw new ApiError(400, "City name, description, and image are required");
  }

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

    const city = new Cities({
      cityName,
      cityDescription,
      cityImage: downloadURL,
      cityImageName: fileName,
    });
    await city.save();

    return res
      .status(200)
      .json(new ApiResponse(200, { data: city }, "City posted successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

//doubtful to use cityname or id used cityname because it would not require store for cities
const postVenueAtCity = asyncHandler(async (req, res) => {
  const { venueCity, venueName, venueDescription } = req.body;
  const file = req.file;

  if (!venueCity || !venueName || !venueDescription || !file) {
    throw new ApiError(400, "All venue details are required");
  }

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
    const city = await Cities.findOne({ cityName: venueCity });

    if (!city) {
      throw new ApiError(404, "City not found");
    }

    const venue = new Venues({
      venueCity,
      venueName,
      venueDescription,
      venueImage: downloadURL,
      venueImageName: fileName,
    });
    await venue.save();

    city.venuesAtCity.push(venue._id);
    await city.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: venue },
          "Venue added to city successfully"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

const deleteCity = asyncHandler(async (req, res) => {
  try {
    if (!req.body.id) {
      throw new ApiError(400, "City ID is required");
    }

    const city = await Cities.findById(req.body.id);
    if (!city) {
      throw new ApiError(404, "City not found");
    }

    try {
      const desertRef = ref(storage, `images/${city.cityImageName}`);
      await deleteObject(desertRef);
      await Cities.findByIdAndDelete(req.body.id);

      return res
        .status(200)
        .json(new ApiResponse(200, null, "City deleted successfully"));
    } catch (error) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, error._baseMessage));
    }
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const deleteVenueAtCity = asyncHandler(async (req, res) => {
  try {
    const { cityName, venueId } = req.body;

    if (!cityName || !venueId) {
      throw new ApiError(400, "City name and venue ID are required");
    }

    const city = await Cities.findOne({ cityName });

    if (!city) {
      throw new ApiError(404, "City not found");
    }

    city.venuesAtCity.pull(venueId);
    await city.save();

    await Venues.findByIdAndDelete(venueId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: city.venuesAtCity },
          "Venue deleted successfully from city"
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const updateCity = asyncHandler(async (req, res) => {
  try {
    const { cityName, cityDescription } = req.body;

    if (!req.body.id || !cityName || !cityDescription) {
      throw new ApiError(400, "City ID, name, and description are required");
    }

    const updatedCity = await Cities.findByIdAndUpdate(
      req.body.id,
      { cityName, cityDescription },
      { runValidators: true, new: true }
    );

    if (!updatedCity) {
      throw new ApiError(404, "City not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { data: updatedCity }, "City updated successfully")
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

module.exports = {
  getAllCitiesExceptSelected,
  getCityById,
  getAllVenuesAtCity,
  postCity,
  postVenueAtCity,
  deleteCity,
  deleteVenueAtCity,
  updateCity,
  getAllCities
};
