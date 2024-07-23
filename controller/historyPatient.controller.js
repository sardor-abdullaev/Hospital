const crud = require("./crud.controller");
const HistoryPatient = require("../model/historyPatient.model");
const Patient = require("../model/patient.model");
const Doctor = require("../model/doctor.model");

const AppError = require("../utils/appError");
const { StatusCodes } = require("http-status-codes");

const createHistoryPatient = crud.createOne(HistoryPatient);
const getAllHistoryPatient = crud.getAll(HistoryPatient);
const getHistoryPatient = crud.getOne(HistoryPatient);
const updateHistoryPatient = crud.updateOne(HistoryPatient);
const deleteHistoryPatient = crud.deleteOne(HistoryPatient);

//==========  MIDDLEWARES  ==========

const checkDoctor = async (req, res, next) => {
  if (req.user.role == "admin") {
    return next();
  }

  let doctorId;
  // create
  if (req.body.patient) {
    const patient = await Patient.findById(req.body.patient);
    doctorId = patient.doctor;
  } else {
    // update delete
    const historyPatient = await HistoryPatient.findById(req.params.id);
    if (historyPatient) doctorId = historyPatient.doctor;
  }

  // get doctor id
  const doctor = await Doctor.findOne({ user: req.user._id });
  // console.log(doctorId, doctor._id, doctorId != doctor.id);

  if (!doctor || doctorId != doctor.id) {
    return next(
      new AppError(
        "You have no permission to carry out this action",
        StatusCodes.FORBIDDEN
      )
    );
  }

  // Set doctor for creating
  req.body.doctor = doctorId;
  next();
};

module.exports = {
  createHistoryPatient,
  getAllHistoryPatient,
  getHistoryPatient,
  updateHistoryPatient,
  deleteHistoryPatient,
  checkDoctor,
};
