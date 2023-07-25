const { connect, connection } = require('mongoose');

const dbName = 'social_network';
const connectionString = process.env.MONGODB_URI || `mongodb://localhost:27017/${dbName}`;

connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = connection;

// Handle connection errors
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Once the connection is open, log a message indicating success
db.once('open', () => {
  console.log(`MongoDB connected to database: ${dbName}`);
});

module.exports = db;