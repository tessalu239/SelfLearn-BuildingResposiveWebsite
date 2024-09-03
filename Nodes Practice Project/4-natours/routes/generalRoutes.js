const express = require('express');
const generalController = require('../controllers/generalController');

const router = express.Router();

//Home page Route
router.get('/', generalController.getHomePage);

//All Tours Route
router.get('/tours', generalController.getAllTours);

router.get('/tours/:id', generalController.getTour);

router.get('/user/login', generalController.loginPage);
router.post('/user/login', generalController.loginFunction);
module.exports = router;
