const express = require("express");
const router = express.Router();

const serviceController = require("../controller/service.controller");
const authController = require("../controller/auth.controller");
const userController = require("../controller/user.controller");
const serviceItemRouter = require("./service-item.route");

router.use("/:serviceId/item", serviceController.setService, serviceItemRouter);

router.use(
  authController.protect,
  authController.restrictTo("admin", "registration")
);

router
  .route("/")
  .post(userController.setUserId, serviceController.createService)
  .get(serviceController.getAllService);

router
  .route("/:id")
  .get(serviceController.getService)
  .patch(serviceController.updateService)
  .delete(serviceController.deleteService);

module.exports = router;
