const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const User = require('./models/User');

const app = express();

// Middleware (Allows the frontend to talk to the backend)
app.use(cors());
app.use(express.json());

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Test Route (To check if server is alive)
app.get('/', (req, res) => {
    res.send('QuantumLearn Server is Running');
});
// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/simulation', require('./routes/Simulation'));
app.use('/api/admin', require('./routes/admin'));
// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});