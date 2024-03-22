// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// * Week 3 assignment
router.get("/detail/:invId", invController.buildByInventoryId);

// Route to handle adding a new classification
router.post(
    "/add-classification",
    regValidate.inventoryRules(),
    regValidate.checkInventoryData, // Use the validateClassification middleware here
    (req, res) => {
        utilities.handleErrors(invController.addClassification)(req, res); // Call the addClassification method in the controller
    }
);

// Route to handle adding a new item
router.post(
    "/add-inventory",
    (req, res) => {
        utilities.handleErrors(invController.addClassification)(req, res); // Call the addClassification method in the controller
    }
);

module.exports = router;