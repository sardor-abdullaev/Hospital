const mongoose = require("mongoose");

const historyDoctorSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  position: String,
  title: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("historyDoctor", historyDoctorSchema);
