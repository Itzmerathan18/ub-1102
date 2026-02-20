const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ayuraksha-secret';

// In-memory OTP store (production: use Redis)
const otpStore = new Map();

// Mock OTP sender
function sendOtp(phone) {
    const otp = '123456'; // Mock OTP for local dev
    otpStore.set(phone, { otp, expires: Date.now() + 10 * 60 * 1000 });
    console.log(`[OTP] ${phone} → ${otp} (mock)`);
    return otp;
}

module.exports = { JWT_SECRET, otpStore, sendOtp };
