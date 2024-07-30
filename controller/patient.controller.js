const crud = require("./crud.controller");
const Patient = require("../model/patient.model");
const Doctor = require("../model/doctor.model");
const { StatusCodes } = require("http-status-codes");
const { createUser } = require("./user.controller");

const createPatient = async (req, res, next) => {
  const userId = await createUser(req, res, next);
  req.body.user = userId;

  crud.createOne(Patient, { path: "user" })(req, res, next);
};

const getAllPatient = crud.getAll(Patient);
const getPatient = crud.getOne(Patient, { path: "user doctor" });
const updatePatient = crud.updateOne(Patient);
const deletePatient = crud.deleteOne(Patient);

const setPatient = (req, res, next) => {
  req.body.patient = req.params.patientId;
  next();
};

const getMyPatients = async (req, res) => {
  if (req.user.role == "doctor") {
    const doctor = await Doctor.findOne({ user: req.user._id });
    req.params.doctorId = doctor._id;
  }

  const patients = await Patient.find({ doctor: req.params.doctorId });

  return res.status(StatusCodes.OK).json({
    status: "success",
    results: patients.length,
    patients,
  });
};

module.exports = {
  createPatient,
  getAllPatient,
  getPatient,
  updatePatient,
  deletePatient,
  setPatient,
  getMyPatients,
};
