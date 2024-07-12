const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/index');

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));

// Management view route
router.get('/', utilities.handleErrors(invController.buildManagementView));

// Placeholder routes for adding classification and inventory
router.get('/add-classification', utilities.handleErrors(invController.addClassificationView));
router.get('/add-inventory', utilities.handleErrors(invController.addInventoryView));

module.exports = router;
