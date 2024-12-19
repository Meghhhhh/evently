const { Router } = require("express");
const router = Router();
const {getVendorDetails,addServiceDetails,updateServiceDetails,deleteServiceDetails,getAllCaterer,getAllPhotographer,getAllDecorator,getAllByServiceType,addImageToVendor,getVendorByUserId} = require("../controllers/vendor.controller")
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post("/getVendorDetails",getVendorDetails)
router.post("/addServiceDetails",addServiceDetails)
router.put("/updateServiceDetails",updateServiceDetails)
router.delete("/deleteServiceDetails/:vendorId", deleteServiceDetails);

router.get("/getAllCaterer",getAllCaterer)
router.get("/getAllPhotographer",getAllPhotographer)
router.get("/getAllDecorator",getAllDecorator)
router.post("/getAllByServiceType",getAllByServiceType)
router.post("/addImageToVendor",upload.single('file'),addImageToVendor)
router.post("/getVendorByUserId",getVendorByUserId)

module.exports = router;