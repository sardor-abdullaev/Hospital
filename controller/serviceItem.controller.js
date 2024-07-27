const crud = require("./crud.controller");
const ServiceItem = require("../model/serviceItem.model");

const createServiceItem = crud.createOne(ServiceItem);
const getAllServiceItem = crud.getAll(ServiceItem);
const getServiceItem = crud.getOne(ServiceItem);
const updateServiceItem = crud.updateOne(ServiceItem);
const deleteServiceItem = crud.deleteOne(ServiceItem);

module.exports = {
  createServiceItem,
  getAllServiceItem,
  getServiceItem,
  updateServiceItem,
  deleteServiceItem,
};
