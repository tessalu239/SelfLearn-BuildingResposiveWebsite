//tours
const express = require('express');
const tourController = require('./../controllers/tourControllers');

const router = express.Router();

//this middleware only runs when the id parameter is present in the URL
router.param('id', tourController.checkID);

router.route('/').get(tourController.getAllTours).post(tourController.addTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.checkBody, tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
