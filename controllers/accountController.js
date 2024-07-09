const bcrypt = require("bcryptjs");
const utilities = require("../utilities");
const accountModel = require("../models/account-model");

/* ****************************************
*  Process Login
* *************************************** */
async function Login(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (accountData) {
      const isValidPassword = await bcrypt.compare(account_password, accountData.account_password);
      if (isValidPassword) {
        req.session.user = accountData;
        req.flash("notice", `Welcome back, ${accountData.account_firstname}`);
        res.status(200).redirect("/");
      } else {
        req.flash("notice", "Incorrect password. Please try again.");
        res.status(401).redirect("/account/login");
      }
    } else {
      req.flash("notice", "No account found with that email address.");
      res.status(404).redirect("/account/login");
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("notice", "Sorry, an error occurred during login.");
    res.status(500).redirect("/account/login");
  }
}

/* ****************************************
*  Deliver Login view
* *************************************** */
async function buildLogin(req, res) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
*  Deliver Registration view
* *************************************** */
async function buildRegister(req, res) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    // Hash the password before storing
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(account_password, 10);
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.');
      return res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      });
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).render("account/register", {
        title: "Registration",
        nav,
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("notice", "Sorry, an error occurred during registration.");
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

module.exports = { buildLogin, Login, buildRegister, registerAccount };
