const express = require("express");
const router = express.Router();

const roomController = require("../controller/room.controller");
const { restrictTo, setUserId, protect } = require("../middleware");

router.use(protect, restrictTo("admin", "hr"));

router
  .route("/")
  .post(setUserId, roomController.createRoom)
  .get(roomController.getAllRoom);

router
  .route("/:id")
  .get(roomController.getRoom)
  .patch(roomController.updateRoom)
  .delete(roomController.deleteRoom);

module.exports = router;
