const mongoose = require("mongoose");
const validator = require("validator");

const workerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  fname: {
    type: String,
    required: [true, "Ismingizni kiriting."],
  },
  mname: {
    type: String,
    required: [true, "Otangizni ismini kiriting."],
  },
  lname: {
    type: String,
    required: [true, "Familiyangizni kiriting."],
  },
  phone: {
    type: String,
    validate: {
      message: "Tel raqam noto'g'ri kiritildi.",
      validator: function (val) {
        return validator.isMobilePhone(val);
      },
    },
  },
  avatar: [{ type: String }],
  email: {
    type: String,
    validate: {
      message: "Email noto'g'ri kiritildi.",
      validator: function (val) {
        return validator.isEmail(val);
      },
    },
  },
  status: Number,
});

module.exports = mongoose.model("Worker", workerSchema);
