const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  region: {
    type: mongoose.Types.ObjectId,
    ref: "Region",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("District", districtSchema);
