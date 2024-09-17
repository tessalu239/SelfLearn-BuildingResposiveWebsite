const express = require("express");
const router = express.Router();
let mealKits = require("../mealkit-utils");
const userModel = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const mealKitModel = require("../models/mealkitsModel");

// Setup a home page route.
router.get("/", (req, res) => {
  mealKitModel
    .find()
    .then((mealkits) => {
      const featuredMeal = mealkits.filter((meal) => meal.featuredMealKit);
      res.render("general/home", { featuredMeal });
    })
    .catch((err) => {
      console.error("Error fetching meal kits:", err);
      res.status(500).send("Server Error");
    });
});

router.get("/headers", (req, res) => {
  const headers = req.headers;

  res.json(headers);
});

//For all the links not required to be implemented
router.get("/random", (req, res) => {
  res.render("general/random");
});

//For all the links not required to be implemented
router.get("/welcome", (req, res) => {
  res.render("general/welcome");
});

// For Registration (GET/signup)
router.get("/sign-up", (req, res) => {
  res.render("general/sign-up", {
    validationMsg: {},
    values: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });
});
// For Registration (POST/signup)
router.post("/sign-up", (req, res) => {
  console.log(req.body);
  const { firstName, lastName, email, password } = req.body;

  let values = req.body;

  let passedValidation = true;
  let validationMsg = {};
  let errors = [];
  //check first name
  if (typeof firstName !== "string") {
    passedValidation = false;
    validationMsg.firstName = "You must specify a first name";
  } else if (firstName.trim().length === 0) {
    passedValidation = false;
    validationMsg.firstName = "First name is required";
  }

  //check last name
  if (typeof lastName !== "string") {
    passedValidation = false;
    validationMsg.lastName = "You must specify a last name";
  } else if (lastName.trim().length === 0) {
    passedValidation = false;
    validationMsg.lastName = "Last name is required";
  }

  //check email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== "string") {
    passedValidation = false;
    validationMsg.email = "You must specify an email";
  } else if (email.trim().length === 0) {
    passedValidation = false;
    validationMsg.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    passedValidation = false;
    validationMsg.email = "Email is invalid";
  }

  //Check password
  if (typeof password !== "string") {
    passedValidation = false;
    validationMsg.password = "Password is required";
  } else if (password.trim().length === 0) {
    passedValidation = false;
    validationMsg.password = "Password is required";
  } else {
    validationMsg.password = "";
    if (password.length < 8 || password.length > 12) {
      passedValidation = false;
      validationMsg.password += "❌8 to 12 characters";
    }
    if (!/[a-z]/.test(password)) {
      passedValidation = false;
      validationMsg.password += "❌at least one lowercase letter";
    }
    if (!/[A-Z]/.test(password)) {
      passedValidation = false;
      validationMsg.password += "❌at least one uppercase letter";
    }
    if (!/\d/.test(password)) {
      passedValidation = false;
      validationMsg.password += "❌at least one number";
    }
    if (!/[!@#$%^&*()_+}{":;'?/>.<,]/.test(password)) {
      passedValidation = false;
      validationMsg.password += "❌at least one special character";
    }
  }

  if (passedValidation) {
    const newUser = new userModel({ firstName, lastName, email, password });

    newUser
      .save()
      .then((userSaved) => {
        console.log(
          `User ${userSaved.firstName} has been saved to the database`
        );
        // Sending confirmation email using SendGrid
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        const msg = {
          //to: "nickroma.seneca@gmail.com", // Send confirmation email to the user's email
          to: email,
          from: "tessalu2399@gmail.com",
          subject: "Registration Form Submission",
          html: `Welcome to HealthyBite🌿 <br>
          Customer's Full Name: ${firstName} ${lastName}<br>
          Customer's Email Address: ${email}<br><br>
          --------Student: Minh Thu (Tessa) Lu--------<br>`,
        };

        sgMail
          .send(msg)
          .then(() => {
            res.redirect("/welcome");
          })
          .catch((err) => {
            console.log(err);
            res.render("general/sign-up", { values, validationMsg });
          });
      })
      .catch((err) => {
        errors.push("Couldn't save the user to the database" + err);
        console.log(errors[0]);
        res.render("general/sign-up", { values, validationMsg, errors });
      });
  } else {
    // Render the sign-up page with validation errors
    res.render("general/sign-up", { values, validationMsg, errors });
  }
});

router.get("/log-in", (req, res) => {
  res.render("general/log-in", {
    validationMsg: {},
    values: {
      email: "",
      role: "",
    },
  });
});

router.post("/log-in", (req, res) => {
  console.log(req.body);
  const { email, password, role } = req.body;

  let values = req.body;

  let passedValidation = true;
  let validationMsg = {};
  let errors = [];

  //check email
  if (typeof email !== "string") {
    passedValidation = false;
    validationMsg.email = "You must specify an email";
  } else if (email.trim().length === 0) {
    passedValidation = false;
    validationMsg.email = "Email is required";
  }

  //Check password
  if (typeof password !== "string") {
    passedValidation = false;
    validationMsg.password = "Password is required";
  } else if (password.trim().length === 0) {
    passedValidation = false;
    validationMsg.password = "Password is required";
  }

  if (passedValidation) {
    userModel
      .findOne({
        email,
      })
      .then((user) => {
        //complete the search(successful)
        if (user) {
          //Found the user document
          //compare the password
          bcryptjs.compare(password, user.password).then((isMatched) => {
            //Done comparing the password
            if (isMatched) {
              //password matched
              //create a session
              //req.session.user=user;
              req.session.user = user;
              // Set isCustomer property based on the role
              req.session.isCustomer = role === "customer";

              //user.role = req.session.isCustomer;
              // Redirect based on role
              if (req.session.isCustomer) {
                user.role = "customer";
                res.redirect("/cart");
              } else {
                user.role = "dataEntryClerk";
                res.redirect("/mealkits/list");
              }
              console.log(user);
            } else {
              //password not matched
              errors.push("The password is not matched");
              console.log(errors[0]);
              res.render("general/log-in", { values, validationMsg, errors });
            }
          });
        } else {
          //user not found
          errors.push("Couldn't find the email in the database");
          console.log(errors[0]);
          res.render("general/log-in", { values, validationMsg, errors });
        }
      })
      .catch((err) => {
        //not able to query the database
        errors.push("Not able to query the database: " + err);
        console.log(errors[0]);
        res.render("general/log-in", { values, validationMsg, errors });
      });
  } else {
    res.render("general/log-in", { values, validationMsg, errors });
  }
});

router.get("/log-out", (req, res) => {
  //Clear the session from memory
  req.session.destroy();

  res.redirect("/log-in");
});

//route to shopping cart
router.get("/cart", (req, res) => {
  if (req.session.user && req.session.user.role === "customer") {
    //const cart = req.session.cart || [];
    prepareView(req, res);
    // console.log(cart);
    // res.render("general/cart", { cart });
  } else {
    res.status(401).send("error");
  }
});
const prepareView = function (req, res, message) {
  let viewModel = {
    message,
    hasMealkits: false,
    cartTotal: 0,
    mealkits: [],
  };

  if (req.session && req.session.user && req.session.user.role === "customer") {
    let cart = req.session.cart || [];

    console.log(cart);
    viewModel.hasMealkits = cart.length > 0;
    let cartTotal = 0;
    cart.forEach((cartMealkit) => {
      cartTotal += cartMealkit.mealkit.price * cartMealkit.qty;
    });

    viewModel.cartTotal = cartTotal;
    viewModel.mealkits = cart;
  }
  res.render("general/cart", viewModel);
};

//Route to add a mealkit to the cart
//the ID of the meal kit will be specified as a part of the URL
router.get("/add-meal/:id", (req, res) => {
  let message;

  const mealkitId = req.params.id;

  if (req.session.user && req.session.user.role === "customer") {
    let cart = (req.session.cart = req.session.cart || []);

    mealKitModel
      .findOne({
        _id: mealkitId,
      })
      .then((mealkit) => {
        console.log(mealkit);
        if (!mealkit) {
          message = "not found in the database";
          prepareView(req, res, message);
          return;
        }
        let found = false;
        cart.forEach((cartMealkit) => {
          if (cartMealkit.id === mealkitId) {
            found = true;
            cartMealkit.qty++;
          }
        });
        if (found) {
          message = `The mealkit ${mealkit.title} was already in the cart`;
        } else {
          cart.push({
            id: mealkitId,
            qty: 1,
            mealkit,
          });
          console.log(cart[0]);
          cart.sort((a, b) => a.mealkit.title.localCompare(b.mealkit.title));

          message = `The mealkit ${mealkit.title} was added to the cart`;
        }
        prepareView(req, res, message);
      })
      .catch(() => {
        message = "The mealkit was not found in the database";
        prepareView(req, res, message);
      });
  } else {
    message = "You must logged in as a customer";
    prepareView(req, res, message);
  }
});
router.get("/remove-meal/:id", (req, res) => {
  const id = req.params.id;
  if (!req.session.cart) {
    req.session.cart = [];
  }
  for (let i = 0; i < req.session.cart.length; i++) {
    if (req.session.cart[i].id === id) {
      req.session.cart.splice(i, 1);
    }
  }
  message = "";
  prepareView(req, res, message);
});

router.post("/update/:id", (req, res) => {
  const id = req.params.id;
  const qty = req.body.qty;
  if (!req.session.cart) {
    req.session.cart = [];
  }
  req.session.cart.forEach((cartMealkit) => {
    if (cartMealkit.id === id) {
      cartMealkit.qty = qty;
    }
  });
  message = "";
  prepareView(req, res, message);
});

const orderDetail = function (cart) {
  let detail = "";
  cart.forEach((item) => {
    let total = item.qty * item.mealkit.price;
    const tax = 0.1;
    let totalTax = total * tax;
    let finalTotal = total + totalTax;
    detail += `
    <tr>
    <td>${item.mealkit.title}</td>
    <td>${item.mealkit.include}</td>
    <td>${item.mealkit.price}</td>
    <td>${item.qty}</td>
    <td>${total.toFixed(2)}</td>
    <td>${tax.toFixed(2)}</td>
    <td>${finalTotal.toFixed(2)}</td>
    </tr>
    `;
  });
  return `<div>
  <h1>Thank you for ordering from HealthyBite🌿</h1>
  <p>Your order detail:</p>
  <table border="1" style="width:100%; border-collapse: collapse;">
  <thead>
  <tr>
  <th>Title</th>
  <th>Includes</th>
  <th>Price</th>
  <th>Quantity</th>
  <th>Subtotal</th>
  <th>Tax</th>
  <th>Total</th>
  </tr>
  </thead>
  <tbody>${detail}</tbody>
  </table>
  </div>`;
};

router.get("/check-out", (req, res) => {
  if (req.session.user && req.session.user.role === "customer") {
    if (req.session.cart && req.session.cart.length > 0) {
      const sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

      const msg = {
        to: req.session.user.email,
        from: "tessalu2399@gmail.com",
        subject: "Your order has been placed",
        html: orderDetail(req.session.cart),
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log("order sent");
          req.session.cart = [];
          let message = "Your order has been confirmed";
          prepareView(req, res, message);
        })
        .catch((err) => {
          console.log(err);
          let message = "Fail to confirm to order";
          prepareView(req, res, message);
        });
    } else {
      message = "shopping cart is empty";
      console.log(message);
      prepareView(req, res, message);
    }
  } else {
    message = "You must logged in as a customer";
    console.log(message);
    prepareView(req, res, message);
  }
});

module.exports = router;
