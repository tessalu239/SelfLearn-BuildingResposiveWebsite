//tours
const express = require('express');
const tourController = require('./../controllers/tourControllers');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

//router.param('id', tourCOntroller.checkID)

//POST /tour/tourID/review
//GET /tour/tourID/review
//GET /tour/tourID/review/userID

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.addNewReview,
//   );
router.use('/:tourId/reviews', reviewRouter);

//this middleware only runs when the id parameter is present in the URL
// router.param('id', tourController.checkID);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthPlan,
  );

//Geospatial Queries: FInding Tour within Radius
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getTourWithin);

//Calculating distances
router.route('/distances/:latlng/unit/:unit').get(tourController.calcDistance);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.addTour,
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
