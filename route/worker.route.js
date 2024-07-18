const express = require("express");
const router = express.Router();

const workerController = require("../controller/worker.controller");
const authController = require("../controller/auth.controller");
const userController = require("../controller/user.controller");
const Worker = require("../model/worker.model");

router.use(authController.protect);

router
  .route("/")
  .post(
    authController.restrictTo("admin", "hr"),
    userController.checkUser("worker"),
    workerController.createWorker
  )
  .get(authController.restrictTo("admin", "hr"), workerController.getAllWorker);

router.use(authController.restrictTo("admin", "hr", "self"));
router
  .route("/:id")
  .get(workerController.getWorker)
  .patch(userController.checkUser("worker"), workerController.updateWorker)
  .delete(userController.deleteUserMid(Worker), workerController.deleteWorker);

module.exports = router;