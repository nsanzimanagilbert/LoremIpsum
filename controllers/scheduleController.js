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

exports.getAllSchedule = factory.getAll(Schedule);
exports.getSchedule = factory.getOne(Schedule);
exports.updateSchedule = factory.updateOne(Schedule);
exports.deleteSchedule = factory.deleteOne(Schedule);
