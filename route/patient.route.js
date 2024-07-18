const express = require("express");
const router = express.Router();

const patientController = require("../controller/patient.controller");
const authController = require("../controller/auth.controller");
const userController = require("../controller/user.controller");

router.use(
  authController.protect,
  authController.restrictTo("registration", "admin")
);

router
  .route("/")
  .post(userController.setUserId, patientController.createPatient)
  .get(patientController.getAllPatient);

router
  .route("/:id")
  .get(patientController.getPatient)
  .patch(patientController.updatePatient)
  .delete(patientController.deletePatient);

module.exports = router;
