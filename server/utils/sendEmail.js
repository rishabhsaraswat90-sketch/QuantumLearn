const axios = require('axios');

const sendEmail = async (email, subject, text) => {
    console.log("--- Email Service (EmailJS HTTP) Starting ---");

    try {
        // Prepare the data for EmailJS
        const data = {
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_PUBLIC_KEY,
            accessToken: process.env.EMAILJS_PRIVATE_KEY,
            template_params: {
                to_email: email,      // The user's email
                to_name: "Researcher", // Generic name or pass it in
                otp: text,            // The OTP code
                subject: subject
            }
        };

        // Send HTTP Request (Port 443 - Never Blocked)
        await axios.post('https://api.emailjs.com/api/v1.0/email/send', data);

        console.log("✅ Email sent successfully via EmailJS");
        return true;

    } catch (error) {
        console.error("❌ EMAIL FAILED");
        if (error.response) {
            console.error("EmailJS Error:", error.response.data);
        } else {
            console.error("Error Message:", error.message);
        }
        throw error;
    }
};

module.exports = sendEmail;