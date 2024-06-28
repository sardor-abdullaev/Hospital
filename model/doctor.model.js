const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Ismingizni kiriting."],
    },
    lname: {
      type: String,
      required: [true, "Ismingizni kiriting."],
    },
    sname: {
      type: String,
      required: [true, "Ismingizni kiriting."],
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
    status: {
      type: Number,
      default: 1,
    },
    spec: {
      type: mongoose.Types.ObjectId,
      ref: "Spec",
      required: true,
    },
    gender: {
      type: Number,
      enum: [1, 2],
      //1-Erkak,2-Ayol
    },
    region: {
      type: mongoose.Types.ObjectId,
      ref: "Region",
      required: true,
    },
    district: {
      type: mongoose.Types.ObjectId,
      ref: "District",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
