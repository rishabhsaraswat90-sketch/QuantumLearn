const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // 1. Force the host
            port: 465,              // 2. Force the Secure Port
            secure: true,           // 3. Use SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        console.log("Attempting to send email to:", email);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text
        });

        console.log("Email sent successfully");
        return true;

    } catch (error) {
        console.error("Email Error:", error);
        throw error; // Throwing ensures the frontend gets the error
    }
};

module.exports = sendEmail;