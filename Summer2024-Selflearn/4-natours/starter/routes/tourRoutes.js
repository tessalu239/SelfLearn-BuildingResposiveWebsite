//tours
const express = require('express');
const tourController = require('./../controllers/tourControllers');

const router = express.Router();

//this middleware only runs when the id parameter is present in the URL
// router.param('id', tourController.checkID);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/').get(tourController.getAllTours).post(tourController.addTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
