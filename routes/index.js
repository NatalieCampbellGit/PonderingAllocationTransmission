const express = require('express');
const router = express.Router();

// User Routes
const userRoutes = require('./userRoutes');
router.use('/users', userRoutes);

// Thought Routes
const thoughtRoutes = require('./thoughtRoutes');
router.use('/thoughts', thoughtRoutes);

// apiRoutes
const apiRoutes = require('./api');
router.use('/api', apiRoutes);

// Default route
router.use((req, res) => res.send('Wrong route!'));

module.exports = router;