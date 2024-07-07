const crud = require("./crud.controller");
const District = require("../model/district.model");

const createDistrict = crud.createOne(District);
const getAllDistrict = crud.getAll(District);
const getDistrict = crud.getOne(District);
const updateDistrict = crud.updateOne(District);
const deleteDistrict = crud.deleteOne(District);

module.exports = {
  createDistrict,
  getAllDistrict,
  getDistrict,
  updateDistrict,
  deleteDistrict,
};
