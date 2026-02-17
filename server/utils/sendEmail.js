const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
    console.log("--- Email Service Starting ---");
    console.log("Strategy: Service 'Gmail' (Auto-Config) / IPv4");

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',       // 👈 LET NODEMAILER HANDLE THE PORTS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            // Network Settings
            family: 4,              // Force IPv4 (Critical for Render)
            logger: true,           // Keep logs on
            debug: true,            // Keep debug on
            connectionTimeout: 10000 // 10 second timeout
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
        throw error; 
    }
};

module.exports = sendEmail;