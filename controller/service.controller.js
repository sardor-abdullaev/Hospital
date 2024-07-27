const crud = require("./crud.controller");
const Service = require("../model/service.model");

const createService = crud.createOne(Service);
const getAllService = crud.getAll(Service);
const getService = crud.getOne(Service);
const updateService = crud.updateOne(Service);
const deleteService = crud.deleteOne(Service);

const setService = (req, res, next) => {
  req.body.serviceId = req.params.serviceId;
  next();
};

module.exports = {
  createService,
  getAllService,
  getService,
  updateService,
  deleteService,
  setService,
};
