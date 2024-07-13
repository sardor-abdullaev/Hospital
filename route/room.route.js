const express = require("express");
const router = express.Router();

const roomController = require("../controller/room.controller");
const authController = require("../controller/auth.controller");
const userController = require("../controller/user.controller");

router.use(authController.protect, authController.restrictTo("admin", "hr"));

router
  .route("/")
  .post(userController.setUserId, roomController.createRoom)
  .get(roomController.getAllRoom);

router
  .route("/:id")
  .get(roomController.getRoom)
  .patch(roomController.updateRoom)
  .delete(roomController.deleteRoom);

module.exports = router;
