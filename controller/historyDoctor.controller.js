const crud = require("./crud.controller");
const HistoryDoctor = require("../model/historyDoctor.model");

const createHistoryDoctor = crud.createOne(HistoryDoctor);
const getAllHistoryDoctor = crud.getAll(HistoryDoctor);
const getHistoryDoctor = crud.getOne(HistoryDoctor);
const updateHistoryDoctor = crud.updateOne(HistoryDoctor);
const deleteHistoryDoctor = crud.deleteOne(HistoryDoctor);

module.exports = {
  createHistoryDoctor,
  getAllHistoryDoctor,
  getHistoryDoctor,
  updateHistoryDoctor,
  deleteHistoryDoctor,
};
