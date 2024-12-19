const { Router } = require("express");
const router = Router();
const {createPackages,updatePackages,deletePackages} = require("../controllers/package.controller")

router.post("/createPackages",createPackages)
router.put("/updatePackages",updatePackages)
router.delete("/deletePackages",deletePackages)

module.exports = router;