const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const doctorController = require("../controller/doctor.controller");

router.use(authController.protect);

router
  .route("/")
  .post(authController.restrictTo("admin", "hr"), doctorController.createDoctor)
  .get(authController.restrictTo("admin", "hr"), doctorController.getAllDoctor);

router.use(authController.restrictTo("admin", "hr", "self"));
router
  .route("/:id")
  .get(doctorController.getDoctor)
  .patch(doctorController.updateDoctor)
  .delete(doctorController.deleteDoctor);

module.exports = router;
