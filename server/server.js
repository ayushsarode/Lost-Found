const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();
app.use('/uploads', express.static('uploads'));

// Middleware
app.use(cors());
app.use(express.json());


app.use(cors({
    origin: [
      'http://localhost:3000', // Replace with the actual origin of your frontend application
      'https://lost-found-six.vercel.app/, // If you have a production frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the necessary HTTP methods
    credentials: true, // If you need to send cookies or other credentials
  }));


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
