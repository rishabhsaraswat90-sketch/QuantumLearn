const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
    console.log("--- Email Service Starting ---");
    console.log("Strategy: Port 465 (SSL) / IPv4");

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,              // 👈 SWITCH BACK TO 465
            secure: true,           // 👈 TRUE for Port 465
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            family: 4,              // 👈 KEEP THIS (Forces IPv4)
            logger: true,           
            debug: true,
            connectionTimeout: 10000 // 👈 Fail fast (10s) instead of waiting 2 mins
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