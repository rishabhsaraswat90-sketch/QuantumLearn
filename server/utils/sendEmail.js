const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", 
            port: 465,             
            secure: true,          
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            // 👇 THIS IS THE FIX
            family: 4 // Forces the code to use IPv4 instead of IPv6
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
        throw error; 
    }
};

module.exports = sendEmail;