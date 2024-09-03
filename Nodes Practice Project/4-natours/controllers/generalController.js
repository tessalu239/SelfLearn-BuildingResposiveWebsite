const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getHomePage = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  const reviews = await Review.find();
  if (!tours || !reviews) {
    console.error('Error fetching');
    res.status(500).send('Server Error');
  }

  const featuredTours = tours.filter((tour) => tour.feature);
  const featuredReviews = reviews.filter((review) => review.featured);

  res.status(200).render('general/home', {
    featuredTours,
    featuredReviews,
  });
});

exports.getAllTours = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  if (!tours) {
    console.error('Error fetching tours:');
    res.status(500).send('Server Error');
  }

  res.status(200).render('general/allTours', { tours });
});

exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.id).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    console.log('Error to fetch the request tour');
    res.status(500).send('Server Error');
  }
  res.status(200).render('general/tour', { tour });
});
exports.loginPage = (req, res) => {
  res.status(200).render('general/login', {
    validationMsg: {},
    values: {
      email: '',
    },
  });
};

exports.loginFunction = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  let values = req.body;

  let passedValidation = true;
  let validationMsg = {};
  let errors = [];

  //check email
  if (typeof email !== 'string') {
    passedValidation = false;
    validationMsg.email = 'You must specify an email';
  } else if (email.trim().length === 0) {
    passedValidation = false;
    validationMsg.email = 'Email is required';
  }

  //Check password
  if (typeof password !== 'string') {
    passedValidation = false;
    validationMsg.password = 'Password is required';
  } else if (password.trim().length === 0) {
    passedValidation = false;
    validationMsg.password = 'Password is required';
  }

  if (passedValidation) {
    await User.findOne({
      email,
    })
      .select('+password')
      .then(async (user) => {
        //complete the search(successful)
        if (user) {
          //Found the user document
          //compare the password
          await user
            .correctPassword(password, user.password)
            .then((isMatched) => {
              //Done comparing the password
              if (isMatched) {
                //password matched
                //create a session
                //req.session.user=user;
                req.session.user = user;

                res.redirect('/');
                console.log(user);
              } else {
                //password not matched
                errors.push('The password is not matched');
                console.log(errors[0]);
                res.render('general/login', { values, validationMsg, errors });
              }
            });
        } else {
          //user not found
          errors.push("Couldn't find the email in the database");
          console.log(errors[0]);
          res.render('general/login', { values, validationMsg, errors });
        }
      })
      .catch((err) => {
        //not able to query the database
        errors.push('Not able to query the database: ' + err);
        console.log(errors[0]);
        res.render('general/login', { values, validationMsg, errors });
      });
  } else {
    res.render('general/login', { values, validationMsg, errors });
  }
};

exports.logout = (req, res) => {
  //Clear the session from memory
  req.session.destroy();

  res.redirect('/user/login');
};
