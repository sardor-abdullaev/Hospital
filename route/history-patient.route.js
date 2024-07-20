const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const historyPatientController = require("../controller/historyPatient.controller");

router.use(
  authController.protect,
  authController.restrictTo("admin", "doctor")
);

router
  .route("/")
  .post(
    historyPatientController.setDoctor,
    historyPatientController.createHistoryPatient
  )
  .get(historyPatientController.getAllHistoryPatient);

router
  .route("/:id")
  .get(historyPatientController.getHistoryPatient)
  .patch(historyPatientController.updateHistoryPatient)
  .delete(historyPatientController.deleteHistoryPatient);

module.exports = router;
