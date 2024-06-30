const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: [true, "Login kiriting."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Parol kiriting."],
    select: false,
  },
  role: {
    type: String,
    enum: [
      "admin",
      "doctor",
      "patient",
      "registration",
      "bugalter",
      "hr",
      "worker",
    ],
    required: true,
  },
  status: {
    type: Number,
    default: 1,
    select: false,
  },
  loginAt: [
    {
      enter: {
        type: Date,
      },
      exit: {
        type: Date,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  // only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("User", userSchema);
