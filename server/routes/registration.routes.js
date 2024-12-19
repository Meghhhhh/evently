const express = require("express");
const router = express.Router();
const {
  register,
  addImageToEvent,
  payment,
  getUserEvents,
  getRecentEventImages,
  getEvents
} = require("../controllers/registration.controller.js");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
const { verifyJWT } = require("../middlewares/auth.middleware.js");

router.post("/registerEvent", register);
router.post("/addImageToEvent",upload.single('eventImage'),addImageToEvent);
router.post("/payment", payment);
router.get("/getUserEvents", verifyJWT, getUserEvents);
router.get("/recentEventImages",getRecentEventImages);
router.get("/recentEvents",getEvents);

module.exports = router;

