const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);
router.get('/', viewsController.getHome);
router.get(
  '/welcome',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getWelcome
);
router.get(
  '/dashboard',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getDashboard
);
router.get(
  '/sessions',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getSessions
);
router.get(
  '/services/counselling',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getCounsellingPage
);
router.get(
  '/schedule',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getCounselling
);
router.get(
  '/services/consultation',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getConsultationPage
);
router.get(
  '/services/consultation/schedule',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getConsultation
);
router.get(
  '/appointments',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getAllSchedules
);
router.get(
  '/appointments/:id',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getSchedule
);

router.get('/users', authController.isLoggedIn, viewsController.getUsers);
router.get(
  '/users/staff',
  authController.isLoggedIn,
  viewsController.getAllStaff
);
router.get(
  '/users/clients',
  authController.isLoggedIn,
  viewsController.getAllClients
);

router.get('/me', authController.protect, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
