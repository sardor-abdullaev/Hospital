const express = require("express");
const router = express.Router();

const Patient = require("../model/patient.model");

const patientController = require("../controller/patient.controller");
const authController = require("../controller/auth.controller");
const userController = require("../controller/user.controller");
const historyPatientRouter = require("./history-patient.route");

// Merge with historyPatientRouter
router.use(
  "/:patientId/history",
  patientController.setPatient,
  historyPatientRouter
);

router.use(authController.protect);

router.use(
  "/bydoctor/:doctorId",
  authController.restrictTo("doctor", "registration", "admin"),
  patientController.getMyPatients
);

router.use(authController.restrictTo("registration", "admin"));

router
  .route("/")
  .post(
    userController.setUserId,
    userController.checkUser,
    patientController.createPatient
  )
  .get(patientController.getAllPatient);

router
  .route("/:id")
  .get(patientController.getPatient)
  .patch(patientController.updatePatient)
  .delete(
    userController.deleteUserMid(Patient),
    patientController.deletePatient
  );

module.exports = router;
