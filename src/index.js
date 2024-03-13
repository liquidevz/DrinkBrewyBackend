'use strict';
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(
    'mongodb+srv://vercel-admin-user:uKWAWdCpSoBDdApC@cluster0.whfrnxl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Routes
const homeRoutes = require('./routes/homeRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api', homeRoutes); // Assuming user routes start with '/users'
app.use('/api', productRoutes); // Assuming user routes start with '/users'

// GET API
app.get('/', (req, res) => {
  res.send('This is a GET API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
