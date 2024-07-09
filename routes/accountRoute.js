const regValidate = require('../utilities/account-validation')
const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to handle login form submission
router.post("/login", utilities.handleErrors(accountController.Login));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )
module.exports = router;
