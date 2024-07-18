const crud = require("./crud.controller");
const Patient = require("../model/patient.model");

const createPatient = crud.createOne(Patient);
const getAllPatient = crud.getAll(Patient);
const getPatient = crud.getOne(Patient);
const updatePatient = crud.updateOne(Patient);
const deletePatient = crud.deleteOne(Patient);

module.exports = {
  createPatient,
  getAllPatient,
  getPatient,
  updatePatient,
  deletePatient,
};
