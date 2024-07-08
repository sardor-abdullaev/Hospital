const crud = require("./crud.controller");
const Spec = require("../model/spec.model");

const createSpec = crud.createOne(Spec);
const getAllSpec = crud.getAll(Spec);
const getSpec = crud.getOne(Spec);
const updateSpec = crud.updateOne(Spec);
const deleteSpec = crud.deleteOne(Spec);

module.exports = {
  createSpec,
  getAllSpec,
  getSpec,
  updateSpec,
  deleteSpec,
};
