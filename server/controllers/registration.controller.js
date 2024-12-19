const Registration = require("../models/registration.model.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { User } = require("../models/user.model.js");
const { Vendor } = require("../models/vendor.model.js");
const { Package } = require("../models/package.model.js");
const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("../config/firebase.config.js");
const { Venues } = require("../models/venues.model.js");
require("dotenv").config();
const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.register = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(401, "Kindly login to register");
    }
    const firstName = user.firstName;
    const lastName = user.lastName;
    const email = user.email;
    const {
      startDate,
      endDate,
      vendors,
      venue,
    } = req.body;
    if (
      !startDate ||
      !endDate ||
      !vendors ||
      !venue
    ) {
      throw new ApiError(400, "Enter all details");
    }

    let sum=0;
    vendors.map(async(obj)=>{
      let pkg = obj.packageId;
      let pack = await Package.findById(pkg);
      sum += pack.price;
    });

    let ven = await Venues.findById(venue);
    sum += ven.venuePrice;


    const userDetails = await Registration.create({
      firstName,
      lastName,
      email,
      startDate,
      endDate,
      vendors,
      venue,
      cost: sum,
      hasHappened: false,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, userDetails, "Event Booking Sucessfull"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong", error.message);
  }
};

exports.addImageToEvent = async (req, res) => {
  try {
    console.log("image api")
    const { regId } = req.body;
    console.log(regId);
    const file = req.file;
    console.log(file); 

    if (!regId) {
      throw new ApiError(404, "No such event found");
    }

    if (!file) {
      throw new ApiError(400, "Insert images to be added");
    }

    const event = await Registration.findById(regId);

    if (!event) {
      throw new ApiError(404, "Event not found");
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

    // Add the image URL to the event
    event.eventImages.push(downloadURL);

    // Save the event with the updated images
    await event.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: event },
          "Images added to event successfully"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

exports.payment = async (req, res) => {
  try {
    const { products } = req.body;
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity, 
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/payment/success",
      cancel_url: "http://localhost:5173/payment/failed",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getUserEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const userEvents = await Registration.find({ email: user.email })
      .populate({
        path: "vendors.vendorId",
        select: "serviceName vendorType",
      })
      .populate("venue", "venueName");

    if (!userEvents || userEvents.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No events found for this user"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, userEvents, "User events fetched successfully")
      );
  } catch (error) {
    console.log(error);

    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

exports.getRecentEventImages = async (req, res) => {
    try {
      const recentEvents = await Registration.find({
        eventImages: { $exists: true, $ne: [] } // Ensures eventImages exists and is not empty
    })
        .sort({ startDate: -1 })
        .limit(3)
        .populate(`vendors.vendorId`, 'serviceName').populate('vendors.packageId', 'packageName price').populate('venue', 'venueName venueCity')

            return res
            .status(200)
            .json(
              new ApiResponse(
                200,
                { data: recentEvents },
                "Images added to event successfully"
              )
            );
    } catch (error) {
      return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

exports.getEvents = async(req,res) => {
  try {
    console.log("api called");
    const events = await Registration.find({});
    if(!events){
      throw new ApiError(404, "Event not found");
    }
    return res
            .status(200)
            .json(
              new ApiResponse(
                200,
                { data: events },
                "Event fetched successfully"
              )
            );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
}