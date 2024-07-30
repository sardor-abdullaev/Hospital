const crud = require("./crud.controller");
const Worker = require("../model/worker.model");
const { createUser } = require("./user.controller");

const createWorker = async (req, res, next) => {
  const userId = await createUser(req, res, next);
  req.body.user = userId;

  crud.createOne(Worker, { path: "user" })(req, res, next);
};

const getAllWorker = crud.getAll(Worker, { path: "user" });
const getWorker = crud.getOne(Worker, { path: "user" });
const updateWorker = crud.updateOne(Worker);
const deleteWorker = crud.deleteOne(Worker);

module.exports = {
  createWorker,
  getAllWorker,
  getWorker,
  updateWorker,
  deleteWorker,
};
