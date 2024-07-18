const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fname: {
      type: String,
      required: [true, "Please provide your name."],
    },
    mname: {
      type: String,
      required: [true, "Please provide your middle name."],
    },
    lname: {
      type: String,
      required: [true, "Please provide your lastname/surname."],
    },
    phone: {
      type: String,
      validate: {
        message: "Not a valid phone number.",
        validator: function (val) {
          return validator.isMobilePhone(val);
        },
      },
    },
    avatar: [{ type: String }],
    email: {
      type: String,
      validate: {
        message: "Email address not valid.",
        validator: function (val) {
          return validator.isEmail(val);
        },
      },
    },
    status: {
      type: Number,
      default: 1,
    },
    spec: {
      type: mongoose.Types.ObjectId,
      ref: "Spec",
      // required: true,
    },
    gender: {
      type: Number,
      enum: [1, 2],
      //1-Erkak,2-Ayol
    },
    region: {
      type: mongoose.Types.ObjectId,
      ref: "Region",
      // required: true,
    },
    district: {
      type: mongoose.Types.ObjectId,
      ref: "District",
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
