const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const expressLayouts = require('express-ejs-layouts');

const session = require('express-session');

const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes.js');
const generalRoutes = require('./routes/generalRoutes.js');

const app = express();

//1) GLOBAL MIDDLEWARE
//Serving static files
app.use(express.static(path.join(__dirname, '/public')));

//Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'script-src': [
          "'self'",
          'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
        ],
        'style-src': [
          "'self'",
          " 'unsafe-inline' ",
          'https://*.googleapis.com',
          'https://unpkg.com',
        ],
        'img-src': [
          "'self'",
          'data:',
          'https://*.openstreetmap.org',
          'https://unpkg.com',
        ],
      },
    },
  }),
);

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.set('view engine', 'ejs');
app.set('layout', path.join(__dirname, 'views/base'));
app.use(expressLayouts);

//Set up body-parser
app.use(express.urlencoded({ extended: false }));

//Set up express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);

app.use((req, res, next) => {
  //Save the user to the global EJS variable "user"
  res.locals.user = req.session.user;

  next();
});

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

//3) Routes
// app.get('/', (req, res) => {
//   res.status(200).render('base', { tour: 'The Forest Hiker', user: 'Jonas' });
// });

//Mounting the routers
app.use('/', generalRoutes);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//all undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in this server`, 404));
});

//MIDDLEWARE FOR HANDLING ERRORS
app.use(globalErrorHandler);

module.exports = app;
