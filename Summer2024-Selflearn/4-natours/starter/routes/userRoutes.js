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

//Update Password
router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

//Update User Information
router
  .route('/updateMe')
  .patch(authController.protect, userController.updateMe);

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
