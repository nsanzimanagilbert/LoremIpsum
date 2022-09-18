const User = require('../models/userModel');
const Schedule = require('../models/scheduleModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getHome = catchAsync(async (req, res, next) => {
  const therapists = await User.find({ role: 'counsellor' });

  res.status(200).render('overview', {
    title: 'Home',
    therapists
  });
});

exports.getWelcome = catchAsync(async (req, res, next) => {
  const counsellors = await User.find({ role: 'counsellor' });
  res.status(200).render('counselling', {
    title: 'Welcome',
    counsellors
  });
});
exports.getConsultationPage = catchAsync(async (req, res, next) => {
  const consultants = await User.find({ role: 'consultant' });
  res.status(200).render('consultation', {
    title: 'Consultaion',
    consultants
  });
});
exports.getConsultation = catchAsync(async (req, res, next) => {
  res.status(200).render('Consultation', {
    title: 'scheduleConsultaion',
    consultants
  });
});
exports.getCounsellingPage = catchAsync(async (req, res, next) => {
  const counsellors = await User.find({ role: 'counsellor' });
  res.status(200).render('counselling', {
    title: 'Counselling',
    counsellors
  });
});
exports.getCounselling = catchAsync(async (req, res, next) => {
  res.status(200).render('counsellingschedule', {
    title: 'Counselling'
  });
});

exports.getDashboard = catchAsync(async (req, res, next) => {
  const totalStaff = await User.find({ duty: 'staff' });
  const totalClients = await User.find({ duty: 'client' });
  const schedules = await Schedule.find();
  const completedSchedules = schedules.filter(sch => !sch.complete);
  res.status(200).render('dashboard', {
    title: 'Dashboard',
    totalClients,
    totalStaff,
    schedules,
    completedSchedules
  });
});
exports.getAllSchedules = catchAsync(async (req, res, next) => {
  const schedules = await Schedule.find().sort({ _id: -1 });
  res.status(200).render('schedules', {
    title: 'Schedules',
    schedules
  });
});
exports.getSchedule = catchAsync(async (req, res, next) => {
  const schedule = await Schedule.findOne({ _id: req.params.id });
  res.status(200).render('singleSchedule', {
    title: 'Schedules',
    schedule
  });
});

exports.getAllMySchedules = catchAsync(async (req, res, next) => {
  const schedules = await Schedule.find({
    sender: req.user.id
  }).sort({ _id: -1 });
  res.status(200).render('mySchedules', {
    title: 'My Appointments',
    schedules
  });
});

exports.getMySchedule = catchAsync(async (req, res, next) => {
  const schedule = await Schedule.findOne({
    _id: req.params.id
  });
  res.status(200).render('mySchedule', {
    title: 'My Appointments',
    schedule
  });
});
exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  const clients = users.filter(user => user.role == 'user');
  const staff = users.filter(staff => staff.duty == 'staff');
  res.status(200).render('users', {
    title: 'Users',
    users,
    staff,
    clients
  });
});
exports.getAllStaff = catchAsync(async (req, res, next) => {
  const staffs = await User.find({ duty: 'staff' });
  res.status(200).render('staffs', {
    title: 'Staff',
    staffs
  });
});
exports.getAllClients = catchAsync(async (req, res, next) => {
  const clients = await User.find({ role: 'user' });
  res.status(200).render('clients', {
    title: 'Clients',
    clients
  });
});
exports.getSessions = catchAsync(async (req, res, next) => {
  res.status(200).render('sessions', {
    title: 'Sessions'
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
