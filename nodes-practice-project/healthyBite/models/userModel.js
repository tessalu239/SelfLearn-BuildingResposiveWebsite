const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: String,
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  role: String,
});

userSchema.pre("save", function (next) {
  let user = this;
  //Generate a unique SALT
  bcryptjs.genSalt().then((salt) => {
    bcryptjs
      .hash(user.password, salt)
      .then((hashedPwd) => {
        user.password = hashedPwd;
        next();
      })
      .catch((err) => {
        console.log(`Error occurred when hashing: ${err}`);
      })
      .catch((err) => {
        console.log(`Error occurred when salting: ${err}`);
        next();
      });
  });
});
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
