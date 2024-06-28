const express = require("express");

const authController = require("../controller/auth.controller");
const userController = require("../controller/user.controller");

const router = express.Router();

router.post("/login", authController.login);

router.use(authController.protect);
router.get("/logout", authController.logout);
router.post(
  "/create",
  authController.isCreateRestricted,
  userController.createUser
);

module.exports = router;
