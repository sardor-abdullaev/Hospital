const express = require("express");
const cookieParser = require("cookie-parser");

const userRouter = require("./route/user.route");

const app = express();
app.use(express.json());

app.use(cookieParser());
app.use("/api/users", userRouter);

module.exports = app;
