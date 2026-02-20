const express = require('express');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /qr - get current QR/emergency access settings
router.get('/', authMiddleware, async (req, res) => {
    try {
        let access = await prisma.emergencyAccess.findUnique({ where: { userId: req.user.id } });
        if (!access) {
            access = await prisma.emergencyAccess.create({
                data: { userId: req.user.id, accessToken: uuidv4() },
            });
        }
        res.json(access);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /qr - update privacy settings
router.put('/', authMiddleware, async (req, res) => {
    try {
        const { isActive, showBloodGroup, showAllergies, showChronicConditions, showMedications } = req.body;
        const updated = await prisma.emergencyAccess.update({
            where: { userId: req.user.id },
            data: { isActive, showBloodGroup, showAllergies, showChronicConditions, showMedications },
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /qr/regenerate - generate new token
router.post('/regenerate', authMiddleware, async (req, res) => {
    try {
        const newToken = uuidv4();
        const updated = await prisma.emergencyAccess.update({
            where: { userId: req.user.id },
            data: { accessToken: newToken, accessCount: 0, lastAccessed: null },
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
