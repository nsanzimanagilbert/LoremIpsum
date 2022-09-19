const Schedule = require('../models/scheduleModel');
const factory = require('./handlerFactory');

const catchAsync = require('./../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createSchedule = catchAsync(async (req, res, next) => {
  // if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.sender = req.user.id;
  const newSchedule = await Schedule.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      schedule: newSchedule
    }
  });
  next(new AppError('Could not create the request', 401));
});

exports.assignSchedule = catchAsync(async (req, res, next) => {
  req.body.assignee = req.user.id;
  const doc = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }
  console.log(doc);
  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.getAllSchedule = factory.getAll(Schedule);
exports.getSchedule = factory.getOne(Schedule);
exports.updateSchedule = factory.updateOne(Schedule);
exports.deleteSchedule = factory.deleteOne(Schedule);
