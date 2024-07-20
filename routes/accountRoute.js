const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities");
const authMiddleware = require('../middleware/auth-middleware');

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to handle login form submission
router.post(
  "/login",
  regValidate.loginRules(),              // Validation rules for login
  regValidate.checkLoginData,            // Middleware to check login data
  utilities.handleErrors(accountController.accountLogin)  // Handle login logic
);

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),       // Validation rules for registration
  regValidate.checkRegData,              // Middleware to check registration data
  utilities.handleErrors(accountController.registerAccount)  // Handle registration logic
);

// Route to the account management view (protected route)
router.get("/", 
  utilities.checkLogin,                  // Middleware to check if user is logged in
  utilities.handleErrors(accountController.managementView)   // Build account management view
);

// Route to the account management view with JWT check
router.get("/accountManagement/", 
  utilities.checkJWTToken,               // Middleware to check JWT token
  utilities.handleErrors(accountController.managementView)   // Build account management view
);

// Apply auth middleware to protected routes
router.use(authMiddleware.checkAuth);

// Routes that require authentication and authorization
router.get('/inventory-management', 
  utilities.handleErrors(accountController.inventoryManagement)); // Build inventory management view

router.post('/add-item', 
  utilities.handleErrors(accountController.addItem));    // Handle adding inventory item

router.post('/edit-item', 
  utilities.handleErrors(accountController.editItem));   // Handle editing inventory item

router.post('/delete-item', 
  utilities.handleErrors(accountController.deleteItem)); // Handle deleting inventory item

// Route to get update account view
router.get('/update-account', utilities.handleErrors(accountController.getUpdateAccount));

// Route to handle updating account information
router.post('/update-account', 
  body('account_firstname').trim().escape(),              // Validate and sanitize firstname
  body('account_lastname').trim().escape(),               // Validate and sanitize lastname
  body('account_email').trim().escape().isEmail(),        // Validate and sanitize email
  utilities.handleErrors(accountController.postUpdateAccount) // Handle update account logic
);

// Route to handle changing account password
router.post('/change-password', 
  utilities.handleErrors(accountController.changePassword)); // Handle changing account password

// Route to handle user logout
router.get('/logout', utilities.handleErrors(accountController.logout));

module.exports = router;
