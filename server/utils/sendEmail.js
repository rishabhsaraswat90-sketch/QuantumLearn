const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
    // 1. Pre-flight Log: Confirm credentials are loaded (Don't show password)
    console.log("--- Email Service Starting ---");
    console.log("User:", process.env.EMAIL_USER ? "Loaded" : "MISSING");
    console.log("Pass:", process.env.EMAIL_PASS ? "Loaded" : "MISSING");
    console.log("Strategy: Port 587 / IPv4");

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,              // SWITCH: Using standard submission port
            secure: false,          // FALSE for Port 587 (It upgrades to secure later)
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            family: 4,              // CRITICAL: Force IPv4
            logger: true,           // NEW: Log every step to console
            debug: true             // NEW: Include SMTP traffic in logs
        });

        console.log(`Attempting to send email to: ${email}`);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text
        });

        console.log("✅ Email sent successfully");
        return true;

    } catch (error) {
        console.error("❌ EMAIL FAILED");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        // This will now show up in your Render logs
        throw error; 
    }
};

module.exports = sendEmail;