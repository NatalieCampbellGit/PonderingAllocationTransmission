// Import packages and files required 
const express = require('express');
const db = require('../config/connection');
const routes = require('./routes');

// Server Port 
const PORT = process.env.PORT || 3001;

//Express App
const app = express();

// Middleware and Routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// Connect to MongoDB
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Mind-Chain server running on port ${PORT}`)
  })
})