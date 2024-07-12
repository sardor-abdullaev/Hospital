const express = require("express");
const router = express.Router();

const doctorController = require("../controller/doctor.controller");
const { restrictTo, protect } = require("../middleware");

router.use(protect);

router
  .route("/")
  .post(restrictTo("admin", "hr"), doctorController.createDoctor)
  .get(restrictTo("admin", "hr"), doctorController.getAllDoctor);

router.use(restrictTo("admin", "hr", "self"));
router
  .route("/:id")
  .get(doctorController.getDoctor)
  .patch(doctorController.updateDoctor)
  .delete(doctorController.deleteDoctor);

module.exports = router;
