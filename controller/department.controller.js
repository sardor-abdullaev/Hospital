const crud = require("./crud.controller");
const Department = require("../model/department.model");

const createDepartment = crud.createOne(Department);
const getAllDepartment = crud.getAll(Department);
const getDepartment = crud.getOne(Department);
const updateDepartment = crud.updateOne(Department);
const deleteDepartment = crud.deleteOne(Department);

module.exports = {
  createDepartment,
  getAllDepartment,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
