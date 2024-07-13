const express = require("express");
const router = express.Router();

const specController = require("../controller/spec.controller");
const authController = require("../controller/auth.controller");
const userController = require("../controller/user.controller");

router.use(authController.protect, authController.restrictTo("admin", "hr"));

router
  .route("/")
  .post(userController.setUserId, specController.createSpec)
  .get(specController.getAllSpec);

router
  .route("/:id")
  .get(specController.getSpec)
  .patch(specController.updateSpec)
  .delete(specController.deleteSpec);

module.exports = router;
