const mongoose = require("mongoose");
const mealkits = require("../mealkit-utils");

const mealkitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  include: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
    required: true,
  },
  cookingTime: {
    type: Number,
    default: 0,
    required: true,
  },
  serving: {
    type: Number,
    default: 0,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  featuredMealKit: {
    type: Boolean,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

const mealkitModel = mongoose.model("mealkits", mealkitSchema);

module.exports = mealkitModel;
