const crud = require("./crud.controller");
const Worker = require("../model/worker.model");

const createWorker = crud.createOne(Worker);
const getAllWorker = crud.getAll(Worker);
const getWorker = crud.getOne(Worker);
const updateWorker = crud.updateOne(Worker);
const deleteWorker = crud.deleteOne(Worker);

module.exports = {
  createWorker,
  getAllWorker,
  getWorker,
  updateWorker,
  deleteWorker,
};
