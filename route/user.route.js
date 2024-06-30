const express = require("express");

const authController = require("../controller/auth.controller");
const userController = require("../controller/user.controller");

const router = express.Router();

router.post("/login", authController.login);

router.use(authController.protect);

router.get("/logout", authController.logout);
router.post("/create", userController.createUser);
router.post("/updateMyPassword", authController.updatePassword);
router.post("/resetPassword", authController.resetToDefaultPassword);
router.get("/me", userController.getMe, userController.getUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
