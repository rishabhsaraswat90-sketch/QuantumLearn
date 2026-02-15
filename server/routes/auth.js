const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

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
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ROUTE 4: Google Login: POST "/api/auth/google". No login required
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        
        // 1. Verify the token with Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, 
        });
        const { name, email, picture } = ticket.getPayload();

        // 2. Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // 3. If new user, create them with a random password
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const securedPassword = await bcrypt.hash(randomPassword, salt);

            user = await User.create({
                name: name,
                email: email,
                password: securedPassword,
                avatar: picture,
                role: "Researcher"
            });
        }

        // 4. Generate Auth Token
        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, JWT_SECRET);

        res.json({ success: true, authToken });

    } catch (error) {
        console.error("Google Auth Error:", error.message);
        res.status(500).send("Internal Server Error");
    }
});
// --- FORGOT PASSWORD ROUTES ---

// ROUTE 7: Send OTP to Email (POST /api/auth/forgotpassword). No login required.
router.post('/forgotpassword', async (req, res) => {
    try {
        const { email } = req.body;
        
        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 2. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Save OTP to Database (Expires in 10 minutes)
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins from now
        await user.save();

        // 4. Send Email
        const subject = "Password Reset - QuantumLearn";
        const message = `Your Verification Code is: ${otp}\n\nThis code expires in 10 minutes.\nIf you did not request this, please ignore this email.`;
        
        await sendEmail(user.email, subject, message);

        res.json({ success: true, message: "OTP sent to email" });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 8: Verify OTP (POST /api/auth/verifyotp). No login required.
router.post('/verifyotp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if OTP matches and hasn't expired
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid or Expired OTP" });
        }

        res.json({ success: true, message: "OTP Verified" });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 9: Reset Password (POST /api/auth/resetpassword). No login required.
router.post('/resetpassword', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Security Check: Verify OTP *again* before changing password
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid or Expired OTP. Please try again." });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(newPassword, salt);

        // Update User
        user.password = securedPassword;
        user.otp = null;       // Clear the OTP so it can't be used twice
        user.otpExpires = null;
        await user.save();

        res.json({ success: true, message: "Password Changed Successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
// ROUTE 7: Send OTP to Email
router.post('/forgotpassword', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const subject = "Password Reset - QuantumLearn";
        const message = `Your Verification Code is: ${otp}\n\nThis code expires in 10 minutes.`;
        
        // 👇 ADDED AWAIT AND ERROR HANDLING
        await sendEmail(user.email, subject, message);

        res.json({ success: true, message: "OTP sent to email" });

    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ error: "Email could not be sent. Check server logs." });
    }
});

module.exports = router;