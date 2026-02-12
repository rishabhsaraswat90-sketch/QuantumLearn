const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Circuit = require('../models/Circuit');
const fetchuser = require('../middleware/fetchuser');

// MIDDLEWARE: Check if the user is actually an Admin
const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ error: "Access Denied: Admins Only" });
        }
        next();
    } catch (error) {
        res.status(500).send("Server Error");
    }
}

// ROUTE 1: Get All Users (GET /api/admin/users)
router.get('/users', fetchuser, verifyAdmin, async (req, res) => {
    try {
        // Fetch all users but hide their passwords
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Get All Circuits (GET /api/admin/circuits)
router.get('/circuits', fetchuser, verifyAdmin, async (req, res) => {
    try {
        // Populate the 'user' field so we see WHO created the circuit
        const circuits = await Circuit.find().populate('user', ['name', 'email']);
        res.json(circuits);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3: Delete a User (DELETE /api/admin/user/:id)
router.delete('/user/:id', fetchuser, verifyAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        // Also delete all circuits belonging to this user (Cleanup)
        await Circuit.deleteMany({ user: req.params.id });
        res.json({ success: true, message: "User and their data deleted" });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;