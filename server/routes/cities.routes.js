const express = require("express");
const router = express.Router();
const {
  getAllCitiesExceptSelected,
  getCityById,
  getAllVenuesAtCity,
  postCity,
  postVenueAtCity,
  deleteCity,
  deleteVenueAtCity,
  updateCity,
  getAllCities
} = require("../controllers/cities.controller.js");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/getAllCitiesExceptSelected", getAllCitiesExceptSelected);
router.get("/getCityById", getCityById);
router.post("/getAllVenuesAtCity", getAllVenuesAtCity);
router.post("/postCity", upload.single("image"), postCity);
router.post("/postVenueAtCity", upload.single("image"),postVenueAtCity);
router.delete("/deleteCity", deleteCity);
router.post("/deleteVenueAtCity", deleteVenueAtCity);
router.put("/updateCity", updateCity);
router.get("/getAllCities", getAllCities);

module.exports = router;
