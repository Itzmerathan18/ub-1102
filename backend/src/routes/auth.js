const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'jeevaloom-secret';

// POST /auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, phoneNumber } = req.body;
        if (!name || !password) return res.status(400).json({ error: 'Name and password required' });
        if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

        const existingName = await prisma.user.findUnique({ where: { name } });
        if (existingName) return res.status(409).json({ error: 'Name already taken' });

        if (email) {
            const existingEmail = await prisma.user.findUnique({ where: { email } });
            if (existingEmail) return res.status(409).json({ error: 'Email already registered' });
        }

        // Check phone uniqueness if provided
        if (phoneNumber) {
            const existingPhone = await prisma.user.findUnique({ where: { phoneNumber } });
            if (existingPhone) return res.status(409).json({ error: 'Phone number already registered' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email: email || `${name}@jeevaloom.app`, passwordHash, name, role: 'patient', ...(phoneNumber ? { phoneNumber } : {}) },
        });

        // Create default health profile
        await prisma.healthProfile.create({
            data: { userId: user.id, fullName: name },
        });

        // Create welcome alert
        await prisma.healthAlert.create({
            data: {
                userId: user.id, alertType: 'system', severity: 'info',
                title: 'Welcome to Jeevaloom!',
                message: 'Start your health journey with an Ayurveda or English Medicine assessment.',
            },
        });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, language: user.language, phoneNumber: user.phoneNumber || null } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /auth/login — supports name and password
router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) return res.status(400).json({ error: 'Name and password are required' });

        const user = await prisma.user.findUnique({ where: { name } });
        if (!user) return res.status(401).json({ error: 'Invalid name or password' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(401).json({ error: 'Invalid name or password' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, language: user.language, phoneNumber: user.phoneNumber || null } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /auth/language — update preferred language
router.put('/language', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
        const decoded = jwt.verify(authHeader.replace('Bearer ', ''), JWT_SECRET);
        const { language } = req.body;
        if (!['en', 'hi', 'kn'].includes(language)) return res.status(400).json({ error: 'Invalid language' });
        const user = await prisma.user.update({ where: { id: decoded.id }, data: { language } });
        res.json({ language: user.language });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
