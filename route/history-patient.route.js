const express = require("express");
const router = express.Router({ mergeParams: true });

const authController = require("../controller/auth.controller");
const historyPatientController = require("../controller/historyPatient.controller");

router.use(authController.protect);

router
  .route("/")
  .post(
    authController.restrictTo("doctor"),
    historyPatientController.checkDoctor,
    historyPatientController.createHistoryPatient
  )
  .get(
    authController.restrictTo("admin", "doctor"),
    historyPatientController.checkDoctor,
    historyPatientController.getAllHistoryPatient
  );

// router.use(
//   authController.restrictTo("doctor"),
//   historyPatientController.checkDoctor
// );

router
  .route("/:id")
  .get(
    authController.restrictTo("admin", "doctor"),
    historyPatientController.checkDoctor,
    historyPatientController.getHistoryPatient
  )
  .patch(
    authController.restrictTo("doctor"),
    historyPatientController.checkDoctor,
    historyPatientController.updateHistoryPatient
  )
  .delete(
    authController.restrictTo("doctor"),
    historyPatientController.checkDoctor,
    historyPatientController.deleteHistoryPatient
  );

module.exports = router;
