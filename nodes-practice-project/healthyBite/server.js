const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const fs = require("fs");

// Set up express
const app = express();

//Set up express-fileupload
app.use(fileUpload());

// Set up dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./config/keys.env" });

// Set up "assets" folder so it is public
app.use(express.static(path.join(__dirname, "/assets")));

// Set up EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.use(expressLayouts);

//Set up body-parser
app.use(express.urlencoded({ extended: false }));

//Set up express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  //Save the user to the global EJS variable "user"
  res.locals.user = req.session.user;

  next();
});

// Middleware to check if user is authenticated
const authenticateUser = (req, res, next) => {
  // Check if user is logged in
  if (!req.session.user) {
    // User is not logged in, send 401 unauthorized status
    return res.status(401).render("error");
  }

  // Check if user is a customer
  if (req.session.user.role === "customer") {
    // Customers cannot access meal kit list
    if (req.originalUrl.includes("/mealkits/list")) {
      return res.status(401).render("error");
    } else {
      // If user is a customer and URL is not /mealkits/list
      next();
    }
  } else if (req.originalUrl.includes("/cart")) {
    // Check if user is a data entry clerk
    // Data entry clerks cannot access shopping cart
    return res.status(401).render("error");
  } else {
    next();
  }
};

app.use("/cart", authenticateUser);
app.use("/mealkits/list", authenticateUser);

const loadDataAuth = (req, res, next) => {
  // Check if user is logged in
  if (!req.session.user) {
    // User is not logged in, send 401 unauthorized status
    return res.status(401).render("error");
  }

  // Check if user is a customer
  if (req.session.isCustomer) {
    // Customers cannot access meal kit list
    if (req.originalUrl.includes("/load-data/mealkits")) {
      return res.status(401).render("error");
    } else {
      // If user is a customer and URL is not /mealkits/list
      next();
    }
  } else if (req.originalUrl.includes("/cart")) {
    // Check if user is a data entry clerk
    // Data entry clerks cannot access shopping cart
    return res.status(401).render("error");
  } else {
    next();
  }
};
app.use("/load-data/mealkits", loadDataAuth);

//Load the controllers into express
const generalController = require("./controllers/generalControllers");
const mealkitsController = require("./controllers/mealkitsControllers");
const loadDataController = require("./controllers/loadDataControllers");

app.use("/", generalController);
app.use("/mealkits/", mealkitsController);
app.use("/load-data/", loadDataController);

// *** DO NOT MODIFY THE LINES BELOW ***

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to MongoDB database");
    app.listen(HTTP_PORT, onHttpStart);
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB database: " + err);
  });
