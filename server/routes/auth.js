const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// SECRET KEY (In real life, put this in .env)
const JWT_SECRET = 'QuantumSecretKey2026'; 

// ROUTE 1: Register a User (Modified)

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Create User (isVerified defaults to false)
        user = await User.create({
            name,
            email,
            password: securedPassword,
            otp: otp,
            otpExpires: Date.now() + 10 * 60 * 1000, // 10 mins
            isVerified: false // Explicitly false
        });

        // Send Email (Don't wait for it to prevent UI lag)
        const subject = "Verify your QuantumLearn Account";
        await sendEmail(user.email, subject, otp);

        // 👇 CRITICAL: Do NOT send authToken yet. Tell frontend to go to verify page.
        res.json({ success: true, requireVerification: true });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 1.5: Verify Signup OTP (NEW ROUTE)
router.post('/verifysignup', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Check OTP
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid or Expired OTP" });
        }

        // Mark Verified & Login
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        // NOW generate the token
        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, JWT_SECRET);

        res.json({ success: true, authToken });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// ROUTE 2: Login (Modified)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid Credentials" });

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) return res.status(400).json({ error: "Invalid Credentials" });

        // 👇 SECURITY CHECK: Block unverified users
        if (user.isVerified === false) {
             // Optional: Resend OTP here if you want to be fancy
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

// ROUTE 4: Google Login (Update to auto-verify)
router.post('/google', async (req, res) => {
    // ... inside the try block ...
        if (!user) {
            // ... (password generation) ...
            user = await User.create({
                name: name,
                email: email,
                password: securedPassword,
                avatar: picture,
                role: "Researcher",
                isVerified: true // 👈 GOOGLE USERS ARE TRUSTED
            });
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
        await sendEmail(user.email, subject, otp);

        res.json({ success: true, message: "OTP sent to email" });

    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ error: "Email could not be sent. Check server logs." });
    }
});

module.exports = router;