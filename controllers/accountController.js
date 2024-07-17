const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const utilities = require("../utilities");
const accountModel = require("../models/account-model");

dotenv.config();

async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  
  if (!accountData) {
    req.flash("error", "Please check your credentials and try again.");
    res.status(400).redirect("/account/login");
    return;
  }
  
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }
      return res.redirect("/account/accountManagement");
    } else {
      req.flash("error", "Incorrect password. Please try again.");
      res.status(401).redirect("/account/login");
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "Sorry, an error occurred during login.");
    res.status(500).redirect("/account/login");
  }
}

async function buildLogin(req, res) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: req.flash("error")
  });
}

async function buildRegister(req, res) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  });
}

async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    let hashedPassword = await bcrypt.hash(account_password, 10);
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash("notice", `Congratulations, ${account_firstname}! Please log in.`);
      res.redirect("/account/login");
    } else {
      req.flash("error", "Sorry, the registration failed.");
      res.status(501).redirect("/account/register");
    }
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error", "Sorry, an error occurred during registration.");
    res.status(500).redirect("/account/register");
  }
}

async function managementView(req, res) {
  let nav = await utilities.getNav();
  res.render('account/accountManagement', {
    title: 'Account Management',
    nav,
    messages: req.flash('notice'),
    errors: null
  });
}

module.exports = { managementView, accountLogin, buildLogin, buildRegister, registerAccount };
