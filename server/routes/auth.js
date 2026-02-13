const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SECRET KEY (In real life, put this in .env)
const JWT_SECRET = 'QuantumSecretKey2026'; 

// ROUTE 1: Register a User (POST /api/auth/register)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        // 2. Hash the password (Security Step)
        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(password, salt);

        // 3. Create the user
        user = await User.create({
            name,
            email,
            password: securedPassword
        });

        // 4. Give them a token (The "ID Card")
        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, JWT_SECRET);

        // 5. Send token to frontend
        res.json({ authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Login a User (POST /api/auth/login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // 2. Compare password (Is "123456" == "$2a$10$X7..."?)
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // 3. Send token
        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
const fetchuser = require('../middleware/fetchuser');

// ROUTE 3: Get Loggedin User Details: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password"); // Select everything EXCEPT password
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Update User Profile: PUT "/api/auth/updateuser". Login required
router.put('/updateuser', fetchuser, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const newUser = {};
    if (name) newUser.name = name;
    if (avatar) newUser.avatar = avatar;

    // Find the user to be updated and update it
    let user = await User.findById(req.user.id);
    if (!user) { return res.status(404).send("Not Found") }

    user = await User.findByIdAndUpdate(req.user.id, { $set: newUser }, { new: true });
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
// ROUTE 5: Change Password: PUT "/api/auth/changepassword". Login required
router.put('/changepassword', fetchuser, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // 1. Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 2. Check if Current Password is correct
        const passwordCompare = await bcrypt.compare(currentPassword, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Incorrect current password" });
        }

        // 3. Hash the New Password
        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(newPassword, salt);

        // 4. Update Database
        await User.findByIdAndUpdate(userId, { password: securedPassword });

        res.json({ success: true, message: "Password Changed Successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;