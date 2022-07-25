const Schedule = require('../models/scheduleModel');
const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllSchedule = factory.getAll(Schedule);
exports.getSchedule = factory.getOne(Schedule);
exports.createSchedule = factory.createOne(Schedule);
exports.updateSchedule = factory.updateOne(Schedule);
exports.deleteSchedule = factory.deleteOne(Schedule);
