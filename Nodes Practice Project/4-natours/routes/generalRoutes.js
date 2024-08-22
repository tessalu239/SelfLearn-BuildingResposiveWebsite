const express = require('express');

const Tour = require('../models/tourModel');
const User = require('../models/userModel');

const router = express.Router();

//Home page Route
router.get('/', async (req, res, next) => {
  const tours = await Tour.find();
  if (!tours) {
    console.error('Error fetching meal kits:');
    res.status(500).send('Server Error');
  }

  const featuredTours = tours.filter((tour) => tour.feature);
  res.status(200).render('general/home', { featuredTours });
});

module.exports = router;
