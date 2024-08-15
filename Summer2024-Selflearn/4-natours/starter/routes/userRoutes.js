const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
//users

const router = express.Router();

//signup
router.route('/signup').post(authController.signUp);
//login
router.route('/login').post(authController.login);
//forget Password
router.route('/forgetPassword').post(authController.forgetPassword);
//reset password
router.route('/resetPassword/:token').patch(authController.resetPassword);

//Middleware for these below routes
router.use(authController.protect);

//Update Password
router.route('/updatePassword').patch(authController.updatePassword);
//Get me
router.route('/me').get(userController.getMe, userController.getUser);
//Update User Information
router.route('/updateMe').patch(userController.updateMe);
//Inactivate User themselves
router.route('/deleteMe').delete(userController.deleteMe);

//Middleware restrict to Admin using only for these below routes
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
