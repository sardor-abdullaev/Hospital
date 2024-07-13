const express = require("express");
const router = express.Router();

const regionController = require("../controller/region.controller");
const authController = require("../controller/auth.controller");

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
