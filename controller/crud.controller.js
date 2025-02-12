const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/appError");

exports.createOne = (Model, popOptions) => async (req, res, next) => {
  let doc = await Model.create(req.body);

  if (popOptions) {
    doc = await Model.findById(doc._id).populate(popOptions);
  }

  return res.status(StatusCodes.CREATED).json({
    status: "success",
    data: doc,
  });
};

exports.getOne = (Model, popOptions) => async (req, res, next) => {
  let query = Model.findById(req.params.id);
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;

  if (!doc) {
    return next(
      new AppError("No document found with that ID", StatusCodes.NOT_FOUND)
    );
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    data: doc,
  });
};

exports.getAll = (Model, popOptions) => async (req, res, next) => {
  let query = Model.find();
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;

  res.status(StatusCodes.OK).json({
    status: "success",
    results: doc.length,
    data: doc,
  });
};

exports.deleteOne = (Model) => async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(
      new AppError("No document found with that ID", StatusCodes.NOT_FOUND)
    );
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: "success",
    data: null,
  });
};

exports.updateOne = (Model) => async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(
      new AppError("No document found with that ID", StatusCodes.NOT_FOUND)
    );
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    data: doc,
  });
};
