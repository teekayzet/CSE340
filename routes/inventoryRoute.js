const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/index');
const { validateClassificationName } = require('../middleware/validation-middleware');

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));

// Management view route
router.get('/', utilities.handleErrors(invController.buildManagementView));

// Route to render the add-classification view
router.get('/add-classification', utilities.handleErrors(invController.addClassificationView));

// Route to handle the form submission for adding a classification
router.post('/add-classification', validateClassificationName, utilities.handleErrors(invController.addClassification));

// Route to render the add-inventory view
router.get('/add-inventory', utilities.handleErrors(invController.addInventoryView));

module.exports = router;
