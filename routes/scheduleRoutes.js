const express = require('express');
const scheduleController = require('../controllers/scheduleController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(scheduleController.getAllSchedule)
  .post(authController.protect, scheduleController.createSchedule);

router
  .route('/:id')
  .get(scheduleController.getSchedule)
  .patch(scheduleController.updateSchedule, scheduleController.assignSchedule)
  .delete(scheduleController.deleteSchedule);

module.exports = router;
