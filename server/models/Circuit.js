const mongoose = require('mongoose');

const CircuitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Connects this circuit to the logged-in User
        required: true
    },
    title: {
        type: String,
        required: true
    },
    circuitData: {
        type: Array, // Stores the [['H', 'X'], ['I']] grid
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Circuit', CircuitSchema);