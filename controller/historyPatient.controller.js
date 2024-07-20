const crud = require("./crud.controller");
const HistoryPatient = require("../model/historyPatient.model");

const createHistoryPatient = crud.createOne(HistoryPatient);
const getAllHistoryPatient = crud.getAll(HistoryPatient);
const getHistoryPatient = crud.getOne(HistoryPatient);
const updateHistoryPatient = crud.updateOne(HistoryPatient);
const deleteHistoryPatient = crud.deleteOne(HistoryPatient);

const setDoctor = (req, res, next) => {
  req.doctor = req.user._id;
  next();
};

module.exports = {
  createHistoryPatient,
  getAllHistoryPatient,
  getHistoryPatient,
  updateHistoryPatient,
  deleteHistoryPatient,
  setDoctor,
};
