const express = require("express");
const cookieParser = require("cookie-parser");

const userRouter = require("./route/user.route");
const doctorRouter = require("./route/doctor.route");
const regionRouter = require("./route/region.route");
const districtRouter = require("./route/district.route");
const specRouter = require("./route/spec.route");

const { errorHandler } = require("./utils/errorHandler");
const AppError = require("./utils/appError");
const { StatusCodes } = require("http-status-codes");

const app = express();
app.use(express.json());

app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/regions", regionRouter);
app.use("/api/districts", districtRouter);
app.use("/api/specs", specRouter);

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
