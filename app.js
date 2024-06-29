const express = require("express");
const cookieParser = require("cookie-parser");

const userRouter = require("./route/user.route");

const { errorHandler } = require("./utils/errorHandler");
const AppError = require("./utils/appError");
const { StatusCodes } = require("http-status-codes");

const app = express();
app.use(express.json());

app.use(cookieParser());
app.use("/api/users", userRouter);

app.all("*", (req, res, next) => {
  return next(
    new AppError(`${req.originalUrl} route topilmadi!`, StatusCodes.NOT_FOUND)
  );
});
app.use(errorHandler);

module.exports = app;
