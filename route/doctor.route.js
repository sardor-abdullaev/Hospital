const express = require("express");
const router = express.Router();

const doctorController = require("../controller/doctor.controller");
const authController = require("../controller/auth.controller");
const userController = require("../controller/user.controller");
const Doctor = require("../model/doctor.model");

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
  .delete(userController.deleteUserMid(Doctor), doctorController.deleteDoctor);

module.exports = router;
