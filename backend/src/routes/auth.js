const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { JWT_SECRET, otpStore, sendOtp } = require('../lib/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// POST /auth/send-otp
router.post('/send-otp', async (req, res) => {
    try {
        const { phone_number } = req.body;
        if (!phone_number) return res.status(400).json({ error: 'Phone number required' });
        sendOtp(phone_number);
        res.json({ message: 'OTP sent successfully', dev_note: 'Use 123456 for local dev' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    try {
        const { phone_number, otp } = req.body;
        if (!phone_number || !otp) return res.status(400).json({ error: 'Phone and OTP required' });

        const stored = otpStore.get(phone_number);
        const isValid = stored && stored.otp === otp && Date.now() < stored.expires;

        if (!isValid) {
            // For dev convenience: accept 123456 always
            if (otp !== '123456') {
                return res.status(400).json({ error: 'Invalid or expired OTP' });
            }
        }

        otpStore.delete(phone_number);

        // Upsert user
        let user = await prisma.user.findUnique({ where: { phoneNumber: phone_number } });
        if (!user) {
            user = await prisma.user.create({
                data: { phoneNumber: phone_number, role: 'patient' },
            });
            // Create default health profile
            await prisma.healthProfile.create({
                data: {
                    userId: user.id,
                    fullName: 'New User',
                    doshaVata: 33,
                    doshaPitta: 33,
                    doshaKapha: 34,
                },
            });
            // Create default emergency access
            await prisma.emergencyAccess.create({
                data: { userId: user.id, accessToken: uuidv4() },
            });
            // Create welcome alert
            await prisma.healthAlert.create({
                data: {
                    userId: user.id,
                    alertType: 'system',
                    severity: 'info',
                    title: 'Welcome to AyuRaksha LifeVault!',
                    message: 'Complete your health profile and add your medications to get started.',
                },
            });
        }

        const token = jwt.sign({ id: user.id, phone: user.phoneNumber, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: user.id, phone_number: user.phoneNumber, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
