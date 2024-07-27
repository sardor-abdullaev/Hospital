const mongoose = require("mongoose");

const serviceItemSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.ObjectId,
    ref: "Service",
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

module.exports = mongoose.model("ServiceItem", serviceItemSchema);
