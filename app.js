const express = require("express");
const cookieParser = require("cookie-parser");

const userRouter = require("./route/user.route");
const workerRouter = require("./route/worker.route");
const doctorRouter = require("./route/doctor.route");
const patientRouter = require("./route/patient.route");

const historyDoctorRouter = require("./route/history-doctor.route");
const historyPatientRouter = require("./route/history-patient.route");

const regionRouter = require("./route/region.route");
const districtRouter = require("./route/district.route");

const specRouter = require("./route/spec.route");
const departmentRouter = require("./route/department.route");
const roomRouter = require("./route/room.route");

const AppError = require("./utils/appError");
const { errorHandler } = require("./utils/errorHandler");
const { StatusCodes } = require("http-status-codes");

const app = express();
app.use(express.json());

app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/workers", workerRouter);
app.use("/api/patients", patientRouter);

app.use("/api/regions", regionRouter);
app.use("/api/districts", districtRouter);

app.use("/api/specs", specRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/history-doctor", historyDoctorRouter);
app.use("/api/history-patient", historyPatientRouter);

app.all("*", (req, res, next) => {
  return next(
    new AppError(
      `Couldn't find ${req.originalUrl} route!`,
      StatusCodes.NOT_FOUND
    )
  );
});
app.use(errorHandler);

module.exports = app;
