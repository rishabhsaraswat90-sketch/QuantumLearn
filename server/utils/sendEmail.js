const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // We will set this in .env next
                pass: process.env.EMAIL_PASS  // We will set this in .env next
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.log("Email not sent", error);
    }
};

module.exports = sendEmail;