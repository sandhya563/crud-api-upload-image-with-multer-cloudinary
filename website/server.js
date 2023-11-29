const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('../website/models/db.conection'); // Import the MongoDB connection module
const productRoutes = require('../website/routes/productRoutes')
const app = express();
const PORT = process.env.PORT || 6500;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
connectDB();
app.use('/', productRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Product API is running on http://localhost:${PORT}`);
});