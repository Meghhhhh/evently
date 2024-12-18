const express = require("express");
const router = express.Router();
const {
  getAllSubVenuesAtVenue,
  postSubVenueAtVenue,
  getVenueById
} = require("../controllers/venue.controller.js");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/getAllSubVenuesAtVenue", getAllSubVenuesAtVenue);
router.post("/postSubVenueAtVenue", upload.single("image"), postSubVenueAtVenue);
router.post("/getVenueById", getVenueById);
//router.get("/getAllVenueAtCityNew", getAllVenueAtCityNew);

module.exports = router;
