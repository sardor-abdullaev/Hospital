const express = require("express");

const authController = require("../controller/auth.controller");
const doctorController = require("../controller/doctor.controller");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .post(
    authController.restrictTo("admin", "hr", "doctor"),
    doctorController.createDoctor
  )
  .get(authController.restrictTo("admin", "hr"), doctorController.getAllDoctor);

router
  .route("/:id")
  .get(authController.restrictTo("admin", "hr"), doctorController.getDoctor)
  .patch(
    authController.restrictTo("admin", "hr", "doctor"),
    doctorController.updateDoctor
  )
  .delete(
    authController.restrictTo("admin", "hr", "doctor"),
    doctorController.deleteDoctor
  );

module.exports = router;
