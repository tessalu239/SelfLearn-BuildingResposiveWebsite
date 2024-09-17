const express = require("express");
const router = express.Router();
let mealKits = require("../mealkit-utils");
const userModel = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const mealkitModel = require("../models/mealkitsModel");
const path = require("path");
const fs = require("fs");
const fileUpload = require("express-fileupload");

router.get("/list", (req, res) => {
  mealkitModel
    .find({})
    .then((mealKits) => {
      res.render("mealkits/list", { mealKits });
    })
    .catch((err) => {
      console.error("Error fetching meal kits:", err);
      res.status(500).send("Server Error");
    });
});

router.get("/on-the-menu", (req, res) => {
  mealkitModel
    .find({})
    .then((mealkits) => {
      const categorizedMeal = mealkits.reduce((acc, mealKit) => {
        if (!acc[mealKit.category]) {
          acc[mealKit.category] = [];
        }
        acc[mealKit.category].push(mealKit);
        return acc;
      }, {});
      res.render("mealkits/on-the-menu", { categorizedMeal });
    })
    .catch((err) => {
      console.error("Error fetching meal kits:", err);
      res.status(500).send("Server Error");
    });
});

router.get("/add", (req, res) => {
  res.render("mealkits/add", {
    validationMsg: {},
    values: {
      title: "",
      include: "",
      description: "",
      category: "",
      price: "",
      cookingTime: "",
      serving: "",
      imageUrl: "",
    },
  });
});

router.post("/add", (req, res) => {
  const { title, include, description, category, price, cookingTime, serving } =
    req.body;

  const featuredMealKit = req.body.featuredMealKit === "on";
  const imageUrl = req.files ? req.files.imageUrl : null;

  let validationMsg = {};
  let passedValidation = true;
  let errorMsg = [];

  // Check for empty fields
  if (!title.trim()) {
    passedValidation = false;
    validationMsg.title = "Title is required";
  } else if (!include.trim()) {
    passedValidation = false;
    validationMsg.include = "Include is required";
  } else if (!description.trim()) {
    passedValidation = false;
    validationMsg.description = "Description is required";
  } else if (!category.trim()) {
    passedValidation = false;
    validationMsg.category = "Category is required";
  } else if (price <= 0) {
    passedValidation = false;
    validationMsg.price = "Price must be greater than 0";
  } else if (cookingTime <= 0) {
    passedValidation = false;
    validationMsg.cookingTime = "Cooking time must be greater than 0";
  } else if (serving <= 0) {
    passedValidation = false;
    validationMsg.serving = "Serving must be greater than 0";
  }

  if (!passedValidation) {
    return res.render("mealkits/add", {
      validationMsg,
      values: req.body,
      errorMsg,
    });
  }

  // Create new meal kit without image
  const newMealKit = new mealkitModel({
    title,
    include,
    description,
    category,
    price,
    cookingTime,
    serving,
    featuredMealKit,
  });

  // If an image is uploaded, save the image file and update the meal kit document with the image URL
  if (imageUrl) {
    const imgName = `mealkit-pic-${newMealKit._id}${path.extname(
      imageUrl.name
    )}`;
    imageUrl.mv(`assets/mealkits-pics/${imgName}`, (err) => {
      if (err) {
        console.error("Error uploading image:", err);
        errorMsg.push(`Error uploading the image: ${err}`);
        res.render("mealkits/add", {
          errorMsg,
          values: req.body,
          validationMsg,
        });
      } else {
        newMealKit.imageUrl = imgName; // Set the imageUrl field
        newMealKit
          .save()
          .then(() => {
            console.log("Meal has been added to the document");
            res.redirect("/mealkits/list");
          })
          .catch((err) => {
            console.error("Error saving the document:", err);
            errorMsg.push(`Error saving the document: ${err}`);
            res.render("mealkits/add", {
              errorMsg,
              values: req.body,
              validationMsg,
            });
          });
      }
    });
  } else {
    // If no image uploaded, save the meal kit document without image
    newMealKit
      .save()
      .then(() => {
        console.log(
          `New meal: ${newMealKit.title} has been added to the database`
        );
        res.redirect("/mealkits/list");
      })
      .catch((err) => {
        console.error("Error saving the document:", err);
        errorMsg.push(`Error saving the document: ${err}`);
        res.render("mealkits/add", {
          errorMsg,
          values: req.body,
          validationMsg,
        });
      });
  }
});

router.get("/edit/:id", (req, res) => {
  const { id } = req.params;

  mealkitModel
    .findById(id)
    .then((mealkit) => {
      if (!mealkit) {
        return res.status(404).send("Meal kit not found");
      }
      res.render("mealkits/edit", { mealkit });
    })
    .catch((err) => {
      console.log(`Error finding meal kit: ${err}`);
      res.status(500).send("Server Error");
    });
});

router.post("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { title, include, description, category, price, cookingTime, serving } =
    req.body;
  const featuredMealKit = req.body.featuredMealKit === "on";

  let imgName = null;
  if (req.files && req.files.imageUrl) {
    const mealkitImg = req.files.imageUrl;
    imgName = `mealkit-pic-${id}${path.parse(mealkitImg.name).ext}`;
    mealkitImg
      .mv(`assets/mealkits-pics/${imgName}`)
      .then(() => {
        return mealkitModel.updateOne(
          { _id: id },
          {
            title,
            include,
            description,
            category,
            price,
            cookingTime,
            serving,
            imageUrl: imgName,
            featuredMealKit: featuredMealKit,
          }
        );
      })
      .then(() => {
        console.log(`Meal kit ${title} has been updated`);
        res.redirect("/mealkits/list");
      })
      .catch((err) => {
        console.log(`Error updating meal kit: ${err}`);
        res.status(500).send("Internal Server Error");
      });
  } else {
    mealkitModel
      .updateOne(
        { _id: id },
        {
          title,
          include,
          description,
          category,
          price,
          cookingTime,
          serving,
          featuredMealKit: featuredMealKit,
        }
      )
      .then(() => {
        console.log(`Meal kit ${title} has been updated`);
        res.redirect("/mealkits/list");
      })
      .catch((err) => {
        console.log(`Error updating meal kit: ${err}`);
        res.status(500).send("Internal Server Error");
      });
  }
});

//Delete a meal kit
router.get("/remove/:id", (req, res) => {
  const { id } = req.params;

  mealkitModel
    .findById(id)
    .then((mealkit) => {
      if (!mealkit) {
        return res.status(404).send("Meal kit not found");
      }
      res.render("mealkits/remove", { mealkit });
    })
    .catch((err) => {
      console.log(`Error finding meal kit: ${err}`);
      res.status(500).send("Server Error");
    });
});

// POST route to handle removing the meal kit
router.post("/remove/:id", (req, res) => {
  const { id } = req.params;
  mealkitModel
    .findByIdAndDelete(id)
    .then((deletedMealKit) => {
      if (!deletedMealKit) {
        return res.status(404).send("Meal kit not found");
      }
      // Delete the image file from the web server
      const imagePath = path.join(
        __dirname,
        "../assets/mealkits-pics",
        deletedMealKit.imageUrl
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Error deleting image file: ${err}`);
        } else {
          console.log("Image file deleted successfully");
        }
      });
      console.log(`Meal kit ${deletedMealKit.title} has been removed`);
      res.redirect("/mealkits/list");
    })
    .catch((err) => {
      console.error(`Error removing meal kit: ${err}`);
      res.status(500).send("Internal Server Error");
    });
});

module.exports = router;
