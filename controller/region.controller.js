const crud = require("./crud.controller");
const Region = require("../model/region.model");

const createRegion = crud.createOne(Region);
const getAllRegion = crud.getAll(Region);
const getRegion = crud.getOne(Region);
const updateRegion = crud.updateOne(Region);
const deleteRegion = crud.deleteOne(Region);

module.exports = {
  createRegion,
  getAllRegion,
  getRegion,
  updateRegion,
  deleteRegion,
};
