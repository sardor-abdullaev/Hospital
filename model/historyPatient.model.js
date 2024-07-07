const mongoose = require("mongoose");

const historyPatientSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  diagnosType: String,
  diagnos: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("historyPatient", historyPatientSchema);
