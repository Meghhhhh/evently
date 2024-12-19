const { Vendor } = require("../models/vendor.model.js");
const { Package } = require("../models/package.model.js");
const { ApiError } = require("../utils/ApiError.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
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

const getVendorDetails = asyncHandler(async (req, res) => {
  try {
    const { vendorId } = req.body;
    console.log(vendorId);
    if (!vendorId) {
      throw new ApiError(400, "Vendor id is required");
    }
    const vendorDetails = await Vendor.findById(vendorId)
      .populate("packages")
      .populate("ratingAndReview");
    //

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: vendorDetails },
          "Vendor Details fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const getVendorByUserId = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);
    if (!userId) {
      throw new ApiError(400, "User id is required");
    }
    const vendorDetails = await Vendor.find({ userId })
      .populate("packages")
      .populate("ratingAndReview");
    //
    console.log("overhere", vendorDetails);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: vendorDetails },
          "Vendor Details fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const addServiceDetails = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const {
      serviceName,
      location,
      about,
      vendorType,
      booking,
      cancellation,
      terms,
      venue,
      singleItems,
      userId,
    } = req.body;
    console.log(
      serviceName,
      location,
      about,
      vendorType,
      booking,
      cancellation,
      terms,
      venue,
      singleItems,
      userId
    );
    if (!serviceName || !location || !about || !vendorType) {
      throw new ApiError(400, "Everything is required to add service details");
    }

    //gallery handling remains
    //  const vendorId = req.body;
    // const vendorDetails = await User.findById(vendorId);

    // if (!vendorDetails) {
    //  throw new ApiError(404, "Vendor not found");
    // }

    const createdService = await Vendor.create({
      serviceName,
      location,
      about,
      vendorType,
      booking,
      cancellation,
      terms,
      venue,
      singleItems,
      userId,
    });
    console.log("balle balle shavs shava");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: createdService },
          "Service created succesfully"
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const updateServiceDetails = asyncHandler(async (req, res) => {
  try {
    const {
      serviceName,
      location,
      about,
      booking,
      cancellation,
      terms,
      vendorId,
      venue,
      singleItems,
    } = req.body;
    //  const vendorId = req.body.vendorId;
    //  const vendorId = req.params.vendorId;
    console.log(
      "huhu",
      serviceName,
      location,
      about,
      vendorId,
      booking,
      cancellation,
      terms
    );
    // if(!serviceName || !location || !about){
    //     throw new  ApiError(400, "Everything is required to update service details");
    // }
    const vendor = await Vendor.findById(vendorId);
    console.log(vendor);
    if (!vendor) {
      throw new ApiError(404, "Vendor not found inside update service");
    }
    console.log("everything present");
    const newService = await Vendor.findByIdAndUpdate(
      vendorId,
      {
        serviceName,
        location,
        about,
        booking,
        cancellation,
        terms,
        singleItems,
      },
      { new: true }
    );
    await newService.save();
    console.log("new");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: newService },
          "Service created succesfully"
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const deleteServiceDetails = asyncHandler(async (req, res) => {
  try {
    console.log("hello");
    const { vendorId } = req.params; // Extract vendorId from params
    console.log(vendorId);

    const service = await Vendor.findByIdAndDelete(vendorId);
    if (!service) {
      throw new ApiError(404, "Service not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Service deleted successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          "Internal server error in deleting service"
        )
      );
  }
});

const getAllCaterer = asyncHandler(async (req, res) => {
  try {
    const catererList = await Vendor.find({ vendorType: "caterer" })
      .populate("packages")
      .populate("ratingAndReview");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: catererList },
          "Caterer Details fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const getAllDecorator = asyncHandler(async (req, res) => {
  try {
    const decoratorList = await Vendor.find({ vendorType: "decorator" })
      .populate("packages")
      .populate("ratingAndReview");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: decoratorList },
          "Decorator Details fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const getAllPhotographer = asyncHandler(async (req, res) => {
  try {
    const photographerList = await Vendor.find({ vendorType: "photographer" })
      .populate("packages")
      .populate("ratingAndReview");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: photographerList },
          "Photographer Details fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const getAllByServiceType = asyncHandler(async (req, res) => {
  try {
    const { vendorType, venue } = req.body;
    const vendors = await Vendor.find({ vendorType: vendorType, venue: venue })
      .populate("packages")
      .populate("ratingAndReview");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: vendors },
          "Vendor Details fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const addImageToVendor = asyncHandler(async (req, res) => {
  try {
    const { vendorId } = req.body;
    const file = req.file;
    console.log(req.body, vendorId, file);
    if (!vendorId) {
      throw new ApiError(404, "Vendor ID is required");
    }

    if (!file) {
      throw new ApiError(400, "Image file is required");
    }

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      throw new ApiError(404, "Vendor not found");
    }

    // Upload the image to storage
    const fileName = `${Date.now()}_${file.originalname}`;
    const storageRef = ref(storage, `images/${fileName}`);
    const metadata = { contentType: file.mimetype };
    const uploadTask = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );
    const downloadURL = await getDownloadURL(uploadTask.ref);

    // Add the image URL to the vendor's gallery
    vendor.gallery.push(downloadURL);

    // Save the vendor with the updated gallery
    await vendor.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: vendor },
          "Image added to vendor gallery successfully"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

module.exports = {
  getVendorDetails,
  addServiceDetails,
  updateServiceDetails,
  deleteServiceDetails,
  getAllCaterer,
  getAllDecorator,
  getAllPhotographer,
  getAllByServiceType,
  addImageToVendor,
  getVendorByUserId,
};
