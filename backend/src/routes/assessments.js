const express = require('express');
const prisma = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /assessments/ayurveda — save dosha assessment
router.post('/ayurveda', authMiddleware, async (req, res) => {
    try {
        const { answers, result, vataScore, pittaScore, kaphaScore } = req.body;
        const record = await prisma.ayurvedaAssessment.create({
            data: {
                userId: req.user.id,
                answers: JSON.stringify(answers),
                result,
                vataScore: vataScore || 0,
                pittaScore: pittaScore || 0,
                kaphaScore: kaphaScore || 0,
            },
        });

        // Update profile
        await prisma.healthProfile.upsert({
            where: { userId: req.user.id },
            update: { primaryDosha: result, doshaVata: vataScore, doshaPitta: pittaScore, doshaKapha: kaphaScore },
            create: { userId: req.user.id, fullName: req.user.name || 'User', primaryDosha: result, doshaVata: vataScore, doshaPitta: pittaScore, doshaKapha: kaphaScore },
        });

        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /assessments/ayurveda — list user's ayurveda history
router.get('/ayurveda', authMiddleware, async (req, res) => {
    try {
        const records = await prisma.ayurvedaAssessment.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /assessments/ayurveda/:id
router.delete('/ayurveda/:id', authMiddleware, async (req, res) => {
    try {
        await prisma.ayurvedaAssessment.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /assessments/health — save health assessment
router.post('/health', authMiddleware, async (req, res) => {
    try {
        const { answers, bmi, riskScore, riskLevel } = req.body;
        const record = await prisma.healthAssessment.create({
            data: {
                userId: req.user.id,
                answers: JSON.stringify(answers),
                bmi: bmi || null,
                riskScore: riskScore || null,
                riskLevel: riskLevel || null,
            },
        });

        // Update profile height/weight if provided (answers[1] and answers[2])
        const height = parseFloat(answers[1]);
        const weight = parseFloat(answers[2]);

        await prisma.healthProfile.upsert({
            where: { userId: req.user.id },
            update: {
                ...(height ? { heightCm: height } : {}),
                ...(weight ? { weightKg: weight } : {}),
            },
            create: {
                userId: req.user.id,
                fullName: req.user.name || 'User',
                ...(height ? { heightCm: height } : {}),
                ...(weight ? { weightKg: weight } : {}),
            },
        });

        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /assessments/health
router.get('/health', authMiddleware, async (req, res) => {
    try {
        const records = await prisma.healthAssessment.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /assessments/health/:id
router.delete('/health/:id', authMiddleware, async (req, res) => {
    try {
        await prisma.healthAssessment.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
