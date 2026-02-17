const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    role: { type: String, default: "Researcher" },
    avatar: { type: String, default: "" },
    
    // 👇 OTP Fields
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    
    // 👇 NEW FIELD: Verification Status
    isVerified: { 
        type: Boolean, 
        default: false 
    }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;