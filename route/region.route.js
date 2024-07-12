const express = require("express");
const router = express.Router();

const regionController = require("../controller/region.controller");
const { restrictTo, protect } = require("../middleware");

router.use(protect, restrictTo("admin"));

router
  .route("/")
  .post(regionController.createRegion)
  .get(regionController.getAllRegion);

router
  .route("/:id")
  .get(regionController.getRegion)
  .patch(regionController.updateRegion)
  .delete(regionController.deleteRegion);

module.exports = router;
