const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: [true, "Login kiriting."],
  },
  password: {
    type: String,
    required: [true, "Parol kiriting."],
  },
  role: {
    type: String,
    enum: ["admin", "doctor", "patient", "registration", "bugalter", "hr"],
    required: true,
  },
  status: {
    type: Number,
    default: 1,
  },
  loginAt: [
    {
      enter: {
        type: Date,
        default: Date.now(),
      },
      exit: Date,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
