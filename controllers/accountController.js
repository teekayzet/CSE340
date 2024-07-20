const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { validationResult } = require("express-validator");
const utilities = require("../utilities");
const accountModel = require("../models/account-model");

dotenv.config();

/**
 * Handle user login.
 */
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

/**
 * Render login view.
 */
async function buildLogin(req, res) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: req.flash("error")
  });
}

/**
 * Render registration view.
 */
async function buildRegister(req, res) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  });
}

/**
 * Handle user registration.
 */
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

/**
 * Render account management view.
 */
async function managementView(req, res) {
  let nav = await utilities.getNav();
  const accountData = res.locals.accountData;  // Get the account data from res.locals

  res.render('account/accountManagement', {
    title: 'Account Management',
    nav,
    messages: req.flash('notice'),
    errors: null,
    account_firstname: accountData.firstName,  // Ensure these field names match
    account_email: accountData.email,
    account_type: accountData.type
  });
}

/**
 * Handle account update.
 */
async function updateAccount(req, res) {
  const { account_firstname, account_lastname, account_email } = req.body;
  const account_id = req.user.account_id;  // Ensure correct user identification
  
  try {
    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);
    if (updateResult) {
      req.flash("notice", "Account information updated successfully.");
      res.redirect("/account/accountManagement");
    } else {
      req.flash("error", "Failed to update account information.");
      res.status(400).redirect("/account/accountManagement");
    }
  } catch (error) {
    console.error("Update account error:", error);
    req.flash("error", "An error occurred while updating account information.");
    res.status(500).redirect("/account/accountManagement");
  }
}

/**
 * Handle password change.
 */
async function changePassword(req, res) {
  const { current_password, new_password, confirm_password } = req.body;
  const account_id = req.user.account_id;  // Ensure correct user identification
  
  try {
    const accountData = await accountModel.getAccountById(account_id);
    if (!await bcrypt.compare(current_password, accountData.account_password)) {
      req.flash('error', 'Current password is incorrect');
      return res.redirect('/account/accountManagement');
    }
    
    if (new_password !== confirm_password) {
      req.flash('error', 'New passwords do not match');
      return res.redirect('/account/accountManagement');
    }
    
    const hashedNewPassword = await bcrypt.hash(new_password, 10);
    const updateResult = await accountModel.updatePassword(account_id, hashedNewPassword);
    if (updateResult) {
      req.flash("notice", "Password changed successfully.");
      res.redirect("/account/accountManagement");
    } else {
      req.flash("error", "Failed to change password.");
      res.status(400).redirect("/account/accountManagement");
    }
  } catch (error) {
    console.error("Change password error:", error);
    req.flash("error", "An error occurred while changing the password.");
    res.status(500).redirect("/account/accountManagement");
  }
}

/**
 * Render update account view.
 */
async function getUpdateAccount(req, res) {
  res.render('account/update-account', {
    title: 'Update Account',
    account_firstname: req.account.account_firstname,
    account_lastname: req.account.account_lastname,
    account_email: req.account.account_email
  });
}

/**
 * Handle account update submission.
 */
async function postUpdateAccount(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', 'Please correct the errors');
    return res.redirect('/account/update-account');
  }
  
  await updateAccount(req, res);
}

/**
 * Handle user logout.
 */
async function logout(req, res) {
  res.clearCookie('jwt');
  req.flash('success', 'Logged out successfully');
  res.redirect('/');
}

module.exports = { 
  managementView, 
  accountLogin, 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  updateAccount, 
  changePassword, 
  getUpdateAccount, 
  postUpdateAccount, 
  logout 
};
