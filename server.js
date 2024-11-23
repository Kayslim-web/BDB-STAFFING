

const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');

// Middleware
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// Controllers
const authController = require('./controllers/auth.js');
const applicationController = require('./controllers/applications.js');

const port = process.env.PORT ? process.env.PORT : '3000';
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView);

// Public Routes
app.get('/', (req, res) => {
  // Check if the user is signed in
  if (req.session.user) {
    // Redirect signed-in users to their applications index
    res.redirect(`/users/${req.session.user._id}/applications`);
  } else {
    // Show the homepage for users who are not signed in
    res.render('index.ejs', { pageTitle: 'Skyrockit' });
  }
});

app.use('/auth', authController);

// Protected Routes
app.use(isSignedIn); // anything below this point will need a user to be signed in
app.use('/users/:userId/applications', applicationController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

















