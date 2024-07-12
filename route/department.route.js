const express = require("express");
const router = express.Router();

const specController = require("../controller/spec.controller");
const { restrictTo, setUserId, protect } = require("../middleware");

router.use(protect, restrictTo("admin", "hr"));

router
  .route("/")
  .post(setUserId, specController.createSpec)
  .get(specController.getAllSpec);

router
  .route("/:id")
  .get(specController.getSpec)
  .patch(specController.updateSpec)
  .delete(specController.deleteSpec);

module.exports = router;
