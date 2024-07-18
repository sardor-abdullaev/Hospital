const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userIdPatient: {
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
      message: "Email address not valid.",
      validator: function (val) {
        return validator.isEmail(val);
      },
    },
  },
  doctor: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  birthday: Date,
  department: {
    type: mongoose.Types.ObjectId,
    ref: "Department",
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
  addres: String,
  arriveDate: {
    type: Date,
    default: Date.now(),
  },
  releaseDate: Date,
  married: Number,
  /*
   1-turmushga chiqqan,
   2-uylangan
   3-turmushga chiqmagan
   4-uylanmagan
  */
  education: String,
  employment: Number,
  /*
  Bandlik holati
   1-ishlaydi,
   2-ishsiz  
  */
  workplace: String,
  familyphone: {
    type: String,
    validate: {
      message: "Invalid phone number",
      validator: function (val) {
        return validator.isMobilePhone(val);
      },
    },
  },
  bloodtype: Number,
  factor: Number,
  policy: String,
  policycompany: String,
  weight: Number,
  height: Number,
  reactions: String,
  status: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("Patient", patientSchema);
