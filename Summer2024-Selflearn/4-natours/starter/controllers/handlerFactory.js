const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      next(new AppError('Cannot find the ID in Database', 404));
    }

    res.status(201).json({
      status: 'success',
      data: null,
    });
  });
