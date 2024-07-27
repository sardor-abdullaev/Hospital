const express = require("express");
const router = express.Router({ mergeParams: true });

const serviceItemController = require("../controller/serviceItem.controller");
const authController = require("../controller/auth.controller");

router.use(
  authController.protect,
  authController.restrictTo("admin", "registration")
);

router
  .route("/")
  .post(serviceItemController.createServiceItem)
  .get(serviceItemController.getAllServiceItem);

router
  .route("/:id")
  .get(serviceItemController.getServiceItem)
  .patch(serviceItemController.updateServiceItem)
  .delete(serviceItemController.deleteServiceItem);

module.exports = router;
