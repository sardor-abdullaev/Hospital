const crud = require("./crud.controller");
const Room = require("../model/room.model");

const createRoom = crud.createOne(Room);
const getAllRoom = crud.getAll(Room);
const getRoom = crud.getOne(Room);
const updateRoom = crud.updateOne(Room);
const deleteRoom = crud.deleteOne(Room);

module.exports = {
  createRoom,
  getAllRoom,
  getRoom,
  updateRoom,
  deleteRoom,
};
