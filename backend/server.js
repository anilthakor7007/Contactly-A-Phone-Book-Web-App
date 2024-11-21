const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

app.use(express.json({ extended: false }));

// Routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact'); 

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes); 


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
