const express = require("express");
const router = express.Router();
const mealKits = require("../mealkit-utils");
const mealkitModel = require("../models/mealkitsModel");

router.get("/mealkits", (req, res) => {
  mealkitModel
    .countDocuments()
    .then((count) => {
      if (count === 0) {
        //There are no documents in the collection, proceed to insert
        mealkitModel
          .insertMany(mealKits.getAllMealKits())
          .then(() => {
            res.render("loadData/loadData", {
              message: "Added meal kits to the database",
            });
          })
          .catch((err) => {
            res.render("loadData/loadData", {
              message: "Error loading meal kits" + err,
            });
          });
      } else {
        // There are existing documents
        // Check for new meal kits to add
        mealkitModel
          .distinct("title")
          .then((existingMealKitTitles) => {
            const newMealKits = mealKits
              .getAllMealKits()
              .filter(
                (mealKit) => !existingMealKitTitles.includes(mealKit.title)
              );
            if (newMealKits.length > 0) {
              mealkitModel
                .insertMany(newMealKits)
                .then(() => {
                  res.render("loadData/loadData", {
                    message: "Added new meal kits to the database",
                  });
                })
                .catch((err) => {
                  res.render("loadData/loadData", {
                    message:
                      "Error adding new meal kits to the database: " + err,
                  });
                });
            } else {
              // All meal kits are already in the database
              res.render("loadData/loadData", {
                message: "All meal kits are already in the database",
              });
            }
          })
          .catch((err) => {
            res.render("loadData/loadData", {
              message:
                "Error checking for existing meal kits in the database: " + err,
            });
          });
      }
    })
    .catch((err) => {
      res.render("loadData/loadData", {
        message:
          "Error checking for existing meal kits in the database: " + err,
      });
    });
});

module.exports = router;
