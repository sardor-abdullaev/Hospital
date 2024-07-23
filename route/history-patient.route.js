const express = require("express");
const router = express.Router({ mergeParams: true });

const authController = require("../controller/auth.controller");
const historyPatientController = require("../controller/historyPatient.controller");

router.use(
  authController.protect,
  authController.restrictTo("doctor"),
  historyPatientController.checkDoctor
);

router
  .route("/")
  .post(
    // authController.restrictTo("doctor"),
    // historyPatientController.checkDoctor,
    historyPatientController.createHistoryPatient
  )
  .get(
    // authController.restrictTo("admin"),
    historyPatientController.getAllHistoryPatient
  );

// router.use(
//   authController.restrictTo("doctor"),
//   historyPatientController.checkDoctor
// );

router
  .route("/:id")
  .get(historyPatientController.getHistoryPatient)
  .patch(historyPatientController.updateHistoryPatient)
  .delete(historyPatientController.deleteHistoryPatient);

module.exports = router;
