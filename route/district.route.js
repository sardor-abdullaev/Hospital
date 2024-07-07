const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const districtController = require("../controller/district.controller");

router.use(authController.protect, authController.restrictTo("admin"));

router
  .route("/")
  .post(districtController.createDistrict)
  .get(districtController.getAllDistrict);

router
  .route("/:id")
  .get(districtController.getDistrict)
  .patch(districtController.updateDistrict)
  .delete(districtController.deleteDistrict);

module.exports = router;
