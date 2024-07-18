const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  userInput: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  departament: {
    type: mongoose.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  number: {
    type: Number,
    min: 1,
  },
  maxCount: {
    type: Number,
    min: 1,
  },
  status: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("Room", roomSchema);
