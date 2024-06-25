// user
// title,
// status
const mongoose = require("mongoose");

const specSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  status: { type: Number, default: 1 },
});

module.exports = mongoose.model("Spec", specSchema);
