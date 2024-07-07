const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const regionController = require("../controller/region.controller");

router.use(authController.protect, authController.restrictTo("admin"));

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
