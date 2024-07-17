const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities");

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to handle login form submission
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.get("/", utilities.checkJWTToken, utilities.handleErrors(accountController.managementView));

router.get("/accountManagement/", utilities.checkJWTToken, utilities.handleErrors(accountController.managementView));

module.exports = router;
