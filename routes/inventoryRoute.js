const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/index');

// Route to build inventory by classification view
router.get('/type/:classificationId', invController.buildByClassificationId);

// Route to build vehicle detail view
router.get('/detail/:vehicleId', invController.buildByVehicleId);

// Management view route
router.get('/', utilities.handleErrors(invController.buildManagementView));

// Future routes for adding classification and inventory
router.get('/add-classification', utilities.handleErrors(invController.addClassificationView)); // Placeholder
router.get('/add-inventory', utilities.handleErrors(invController.addInventoryView)); // Placeholder

module.exports = router;
