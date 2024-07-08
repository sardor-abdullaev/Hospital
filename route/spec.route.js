const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const specController = require("../controller/spec.controller");

router.use(authController.protect, authController.restrictTo("admin"));

router
  .route("/")
  .post(specController.createSpec)
  .get(specController.getAllSpec);

router
  .route("/:id")
  .get(specController.getSpec)
  .patch(specController.updateSpec)
  .delete(specController.deleteSpec);

module.exports = router;
