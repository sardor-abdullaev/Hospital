const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("Region", regionSchema);
