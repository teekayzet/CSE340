const jwt = require('jsonwebtoken');
const accountModel = require('../models/account-model');

async function checkAuth(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect('/account/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const account = await accountModel.getAccountByEmail(decoded.account_email);
    if (!account || account.account_type !== 'Employee' && account.account_type !== 'Admin') {
      return res.redirect('/account/login');
    }
    req.account = account;
    next();
  } catch (error) {
    console.error(error);
    return res.redirect('/account/login');
  }
}

module.exports = { checkAuth };