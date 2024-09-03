const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('./../utils/email');
//const jwt = require('jsonwebtoken');

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

// SIGNUP
exports.signupPage = (req, res) => {
  res.render('general/signup', {
    validationMsg: {},
    values: {
      name: '',
      email: '',
    },
  });
};

exports.signupFunction = async (req, res) => {
  console.log(req.body);
  const { name, email, password, passwordConfirm } = req.body;

  let values = req.body;

  let passedValidation = true;
  let validationMsg = {};
  let errors = [];
  //check first name
  if (typeof name !== 'string') {
    passedValidation = false;
    validationMsg.name = 'You must specify a first name';
  } else if (name.trim().length === 0) {
    passedValidation = false;
    validationMsg.name = 'First name is required';
  }

  //check email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== 'string') {
    passedValidation = false;
    validationMsg.email = 'You must specify an email';
  } else if (email.trim().length === 0) {
    passedValidation = false;
    validationMsg.email = 'Email is required';
  } else if (!emailRegex.test(email)) {
    passedValidation = false;
    validationMsg.email = 'Email is invalid';
  }

  //Check password
  if (typeof password !== 'string') {
    passedValidation = false;
    validationMsg.password = 'Password is required';
  } else if (password.trim().length === 0) {
    passedValidation = false;
    validationMsg.password = 'Password is required';
  } else {
    validationMsg.password = '';
    if (password.length < 8 || password.length > 12) {
      passedValidation = false;
      validationMsg.password += '❌8 to 12 characters';
    }
    if (!/[a-z]/.test(password)) {
      passedValidation = false;
      validationMsg.password += '❌at least one lowercase letter';
    }
    if (!/[A-Z]/.test(password)) {
      passedValidation = false;
      validationMsg.password += '❌at least one uppercase letter';
    }
    if (!/\d/.test(password)) {
      passedValidation = false;
      validationMsg.password += '❌at least one number';
    }
    if (!/[!@#$%^&*()_+}{":;'?/>.<,]/.test(password)) {
      passedValidation = false;
      validationMsg.password += '❌at least one special character';
    }
  }

  if (passedValidation) {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      // role: req.body.role,
    });

    newUser
      .save()
      .then((userSaved) => {
        console.log(`User ${userSaved.name} has been saved to the database`);

        const msg = {
          //to: "nickroma.seneca@gmail.com", // Send confirmation email to the user's email
          subject: 'Registration Form Submission',
          html: `Welcome to BambooTravel🎍 <br>
          Customer's Full Name: ${name}<br>
          Customer's Email Address: ${email}<br><br>
          -------- Minh Thu (Tessa) Lu--------<br>`,
        };

        sendEmail({
          email: userSaved.email,
          subject: 'Registration Form Submission',
          msg,
        })
          .then(() => {
            res.redirect('/');
          })
          .catch((err) => {
            console.log(err);
            res.render('general/signup', { values, validationMsg });
          });
      })
      .catch((err) => {
        errors.push("Couldn't save the user to the database" + err);
        console.log(errors[0]);
        res.render('general/signup', { values, validationMsg, errors });
      });
  } else {
    // Render the sign-up page with validation errors
    res.render('general/signup', { values, validationMsg, errors });
  }
};
