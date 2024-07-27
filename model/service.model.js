const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  userInput: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("Service", serviceSchema);
