const express = require("express");
const router = express.Router({ mergeParams: true });

const authController = require("../controller/auth.controller");
const historyDoctorController = require("../controller/historyDoctor.controller");

router.use(authController.protect, authController.restrictTo("admin", "hr"));

router
  .route("/")
  .post(
    historyDoctorController.setDoctor,
    historyDoctorController.createHistoryDoctor
  )
  .get(historyDoctorController.getAllHistoryDoctor);

router
  .route("/:id")
  .get(historyDoctorController.getHistoryDoctor)
  .patch(historyDoctorController.updateHistoryDoctor)
  .delete(historyDoctorController.deleteHistoryDoctor);

module.exports = router;
