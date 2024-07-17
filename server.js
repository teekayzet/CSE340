const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv");
const utilities = require("./utilities/index");
const pool = require("./database/"); // Ensure to import your database connection setup
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Connect flash middleware
app.use(flash());

// Custom middleware to expose flash messages to all templates
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// EJS setup
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Cookie parser middleware
app.use(cookieParser());

// JWT token check middleware
app.use(utilities.checkJWTToken);

// Routes
const staticRoutes = require("./routes/static"); // Example static routes
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");

app.use(staticRoutes); // Example static routes usage
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);

// Error handling middleware for 404 and other errors
app.use((req, res, next) => {
  next({ status: 404, message: "Oops! Something went wrong." });
});

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}":`, err);
  const message =
    err.status == 404
      ? err.message
      : "Oh no! There was a server error. Please try again later.";
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
