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
  (req, res, next) => {
    req.body.patient = req.params.patientId;
    next();
  },
  historyPatientRouter
);

router.use(
  authController.protect,
  authController.restrictTo("registration", "admin")
);

router
  .route("/")
  .post(
    userController.setUserId,
    userController.checkUser("patient"),
    patientController.createPatient
  )
  .get(patientController.getAllPatient);

router
  .route("/:id")
  .get(patientController.getPatient)
  .patch(userController.checkUser("patient"), patientController.updatePatient)
  .delete(
    userController.deleteUserMid(Patient),
    patientController.deletePatient
  );

module.exports = router;
