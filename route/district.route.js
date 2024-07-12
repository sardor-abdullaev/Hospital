const express = require("express");
const router = express.Router();

const districtController = require("../controller/district.controller");
const { restrictTo, protect } = require("../middleware");

router.use(protect, restrictTo("admin"));

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
