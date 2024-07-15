const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to render add classification view
router.get("/add-classification", utilities.handleErrors(invController.addClassificationView));

// Route to handle add classification form submission
router.post("/add-classification", utilities.handleErrors(invController.addClassification));

// Route to render add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.addInventoryView));

// Route to handle add inventory form submission
router.post("/add-inventory", utilities.handleErrors(invController.addInventory)); // Add this if it's not present

module.exports = router;
