const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const fetchuser = require('../middleware/fetchuser');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = 'QuantumSecretKey2026'; 

// ROUTE 1: Register (Sends OTP, does NOT login yet)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(password, salt);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user = await User.create({
            name,
            email,
            password: securedPassword,
            otp: otp,
            otpExpires: Date.now() + 10 * 60 * 1000,
            isVerified: false // Must verify email
        });

        const subject = "Verify your QuantumLearn Account";
        await sendEmail(user.email, subject, otp);

        res.json({ success: true, requireVerification: true });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 1.5: Verify Signup OTP
router.post('/verifysignup', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid or Expired OTP" });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ success: true, authToken });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// ROUTE 2: Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid Credentials" });

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) return res.status(400).json({ error: "Invalid Credentials" });

        if (user.isVerified === false) {
            return res.status(400).json({ error: "Please verify your email first." });
        }

        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3: Get User Details
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Update User Profile
router.put('/updateuser', fetchuser, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const newUser = {};
    if (name) newUser.name = name;
    if (avatar) newUser.avatar = avatar;

    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).send("Not Found");

    user = await User.findByIdAndUpdate(req.user.id, { $set: newUser }, { new: true });
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 5: Change Password
router.put('/changepassword', fetchuser, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const passwordCompare = await bcrypt.compare(currentPassword, user.password);
        if (!passwordCompare) return res.status(400).json({ error: "Incorrect current password" });

        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(newPassword, salt);
        await User.findByIdAndUpdate(req.user.id, { password: securedPassword });

        res.json({ success: true, message: "Password Changed Successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 6: Google Login
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, 
        });
        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const securedPassword = await bcrypt.hash(randomPassword, salt);

            user = await User.create({
                name: name,
                email: email,
                password: securedPassword,
                avatar: picture,
                role: "Researcher",
                isVerified: true // Auto-verify Google users
            });
        } else {
            // If they signed up manually before but didn't verify, verify them now via Google
            if (user.isVerified === false) {
                user.isVerified = true;
                await user.save();
            }
        }

        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ success: true, authToken });

    } catch (error) {
        console.error("Google Auth Error:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 7: Send OTP (Forgot Password)
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
        await sendEmail(user.email, subject, otp);

        res.json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ error: "Email could not be sent. Check server logs." });
    }
});

// ROUTE 8: Verify OTP (Forgot Password)
router.post('/verifyotp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid or Expired OTP" });
        }
        res.json({ success: true, message: "OTP Verified" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 9: Reset Password
router.post('/resetpassword', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid or Expired OTP. Please try again." });
        }

        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(newPassword, salt);
        user.password = securedPassword;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({ success: true, message: "Password Changed Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;