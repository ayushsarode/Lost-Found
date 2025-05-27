const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();
app.use('/uploads', express.static('uploads'));


app.use(express.json());


app.use(cors({
    origin: [
      'https://lost-found-six.vercel.app',
      'http://localhost:5173'

    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the necessary HTTP methods
    credentials: true, // If you need to send cookies or other credentials
  }));


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
