const crud = require("./crud.controller");
const HistoryDoctor = require("../model/historyDoctor.model");

const createHistoryDoctor = crud.createOne(HistoryDoctor);
const getAllHistoryDoctor = crud.getAll(HistoryDoctor);
const getHistoryDoctor = crud.getOne(HistoryDoctor, { path: "doctor" });
const updateHistoryDoctor = crud.updateOne(HistoryDoctor);
const deleteHistoryDoctor = crud.deleteOne(HistoryDoctor);

const setDoctor = async (req, res, next) => {
  if (!req.body.doctor) req.body.doctor = req.params.doctorId;
  next();
};

module.exports = {
  createHistoryDoctor,
  getAllHistoryDoctor,
  getHistoryDoctor,
  updateHistoryDoctor,
  deleteHistoryDoctor,
  setDoctor,
};
