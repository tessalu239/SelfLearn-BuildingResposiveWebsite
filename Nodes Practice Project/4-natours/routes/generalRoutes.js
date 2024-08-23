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
      featuredReviews,
      featuredTours,
    });
  }),
);

//All Tours Route
router.get(
  '/alltours',
  catchAsync(async (req, res) => {
    const tours = await Tour.find();

    if (!tours) {
      console.error('Error fetching meal kits:');
      res.status(500).send('Server Error');
    }

    res.status(200).render('general/allTours', { tours });
  }),
);

module.exports = router;
