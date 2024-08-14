const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  //1. Create error id user wanna change password data ==> ask them to use /updatePassword
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This site is not for updating password, please use /updatePassword instead',
        400,
      ),
    );
  }
  //2.Filtered out unwanted fields names that awe not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  //3. Update User document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: true });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('No ID found in the database', 404));
  res.status(200).json({
    status: 'success',
    data: { user },
  });
});
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.deleteUser = factory.deleteOne(User);
