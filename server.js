const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

// Initialize the app
const app = express();

// BodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB configuration
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

// Define routes
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
app.use('/api/users', users);
app.use('/api/profiles', profiles);

// Serve static files from the Vue.js frontend folder
app.use(express.static(path.join(__dirname, '前端')));

// Handle SPA (Single Page Application) routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '前端', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
