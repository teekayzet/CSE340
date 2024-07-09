// Require necessary external resources
const express = require('express');
const router = express.Router();
const utils = require('../utilities/index');
const accountController = require('../controllers/accountController'); // Ensure this path is correct

// Define the "GET" route for the "My Account" link
router.get('/login', accountController.buildLogin);

// Error handler middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Export the router
module.exports = router;
