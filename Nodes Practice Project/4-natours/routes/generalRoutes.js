const express = require('express');
const generalController = require('../controllers/generalController');

const authController = require('../controllers/authController');

const router = express.Router();

//Home page Route
router.get('/', generalController.getHomePage);

//All Tours Route
router.get('/tours', generalController.getAllTours);

router.get('/tours/:id', generalController.getTour);

router.get('/user/login', generalController.loginPage);
router.post('/user/login', generalController.loginFunction);
router.get('/logout', generalController.logout);

router.get('/signup', generalController.signupPage);
router.post('/signup', generalController.signupFunction);

router.get('/account', authController.protect, generalController.getAccount);
module.exports = router;
