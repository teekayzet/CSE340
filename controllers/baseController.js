const utilities = require('../utilities'); // Adjust the path as necessary
const baseController = {};

baseController.buildHome = async function(req, res) {
  const nav = await utilities.getNav();
  req.flash("notice", "This is a flash message.");

  res.render("index", {
    title: "Home",
    nav,
    cookies: req.cookies, // Pass cookies to the template
    account_firstname: req.account ? req.account.account_firstname : '', // Pass account information if needed
  });
};

exports.buildHome = (req, res) => {
  res.render('home', { title: 'Home Page' });
};

module.exports = baseController;
