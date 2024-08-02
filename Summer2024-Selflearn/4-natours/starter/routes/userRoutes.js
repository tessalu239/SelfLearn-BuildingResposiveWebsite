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
router.route('/resetPassword').post(authController.resetPassword);
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
