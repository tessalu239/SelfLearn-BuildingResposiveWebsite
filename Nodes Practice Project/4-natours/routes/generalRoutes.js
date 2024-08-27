const express = require('express');

const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

//Home page Route
router.get(
  '/',
  catchAsync(async (req, res, next) => {
    const tours = await Tour.find();
    const reviews = await Review.find();
    if (!tours || !reviews) {
      console.error('Error fetching meal kits:');
      res.status(500).send('Server Error');
    }

    const featuredTours = tours.filter((tour) => tour.feature);
    const featuredReviews = reviews.filter((review) => review.featured);

    res.status(200).render('general/home', {
      featuredTours,
      featuredReviews,
    });
  }),
);

//All Tours Route
router.get(
  '/tours',
  catchAsync(async (req, res) => {
    const tours = await Tour.find();

    if (!tours) {
      console.error('Error fetching tours:');
      res.status(500).send('Server Error');
    }

    res.status(200).render('general/allTours', { tours });
  }),
);

router.get(
  '/tours/:id',
  catchAsync(async (req, res) => {
    const tour = await Tour.findById(req.params.id).populate({
      path: 'reviews',
      fields: 'review rating user',
    });

    if (!tour) {
      console.log('Error to fetch the request tour');
      res.status(500).send('Server Error');
    }
    res.status(200).render('general/tour', { tour });
  }),
);

module.exports = router;
