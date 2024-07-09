/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
const session = require("express-session");
const pool = require('./database/');
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require('./routes/inventoryRoute');
const accountRoute = require('./routes/accountRoute'); // New account route
const utilities = require('./utilities/index');
const bodyParser = require("body-parser");

/* ***********************
 * Middleware
 ************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

/* View Engine and Templates */
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* Routes */
app.use(static);
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute); // New account route

// File Not Found Route
app.use((req, res, next) => {
  next({status: 404, message: 'Oops! Something went wrong. But hey, even the best of us make mistakes! 🐱‍💻'});
});

/* Express Error Handler */
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}":`, err);
  const message = err.status == 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});

/* Local Server Information */
const port = process.env.PORT || 3000; // Default to 3000 if PORT is not defined
const host = process.env.HOST || 'localhost'; // Default to 'localhost' if HOST is not defined

/* Start Server */
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
