/* eslint-disable prettier/prettier */
const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);
router.get('/', viewsController.getHome);
router.get('/signin', viewsController.getSignin);
router.get('/signup', viewsController.getSignup);

router.get(
  '/welcome',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getWelcome
);
router.get('/resources', viewsController.getResourcesPage);
router.get('/therapists', viewsController.getTherapistsPage);

router.get(
  '/dashboard',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getDashboard
);
router.get(
  '/sessions',
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
  '/myappointments',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getAllMySchedules
);
router.get(
  '/myappointments/:id',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getMySchedule
);

router.get(
  '/myassignments',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getAllMyAssigned
);

router.get(
  '/myassignments/:id',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getMyAssignment
);
router.get(
  '/appointments/:id',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getSchedule
);

router.get('/users', authController.isLoggedIn, viewsController.getUsers);
router.get('/staff', authController.isLoggedIn, viewsController.getAllStaff);
router.get(
  '/clients',
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
