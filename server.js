const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
const utilities = require('./utilities/index');
const pool = require('./database/');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

// Connect flash middleware
app.use(flash());

// Cookie parser middleware
app.use(cookieParser());

// Middleware to add cookies and account_firstname to all views
app.use((req, res, next) => {
  res.locals.cookies = req.cookies;
  res.locals.account_firstname = req.cookies.account_firstname || '';
  res.locals.messages = req.flash();
  next();
});

// JWT token check middleware
app.use(utilities.checkJWTToken);

// EJS setup
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');
app.set('views', path.join(__dirname, 'views'));

// Routes
const staticRoutes = require('./routes/static');
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const accountRoute = require('./routes/accountRoute');
const chatbotRoute = require('./routes/chatbotRoute');

app.use(staticRoutes);
app.get('/', utilities.handleErrors(baseController.buildHome));
app.use('/inv', inventoryRoute);
app.use('/account', accountRoute);
app.use('/chatbot', chatbotRoute); // Ensure this is correct
app.get('/chatbot/chatbot', async (req, res) => {
  const nav = await utilities.getNav(); // Assuming this is a function that fetches the navigation data
  res.render('chatbot/chatbot', {
    title: 'Chatbot', // Define the title here
    nav, // Define the nav variable here
  });
});



// Error handling middleware
app.use((req, res, next) => {
  next({ status: 404, message: 'Oops! Something went wrong.' });
});

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}":`, err);
  const message =
    err.status == 404
      ? err.message
      : 'Oh no! There was a server error. Please try again later.';
  res.status(err.status || 500).render('errors/error', {
    title: err.status || 'Server Error',
    message,
    nav,
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
