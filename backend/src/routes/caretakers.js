const express = require('express');
const prisma = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /caretakers/invite
router.post('/invite', authMiddleware, async (req, res) => {
    try {
        const { caretakerPhone, relationship, canEditMedications, canUploadReports, canEditProfile } = req.body;

        let caretakerUser = await prisma.user.findUnique({ where: { phoneNumber: caretakerPhone } });
        if (!caretakerUser) {
            caretakerUser = await prisma.user.create({
                data: { phoneNumber: caretakerPhone, role: 'caretaker' },
            });
        }

        const existing = await prisma.caretaker.findFirst({
            where: { patientId: req.user.id, caretakerId: caretakerUser.id },
        });
        if (existing) return res.status(400).json({ error: 'Already invited this caretaker' });

        const caretaker = await prisma.caretaker.create({
            data: {
                patientId: req.user.id,
                caretakerId: caretakerUser.id,
                relationship,
                canEditMedications: canEditMedications || false,
                canUploadReports: canUploadReports || false,
                canEditProfile: canEditProfile || false,
            },
        });

        res.status(201).json(caretaker);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /caretakers - list caretakers for current patient
router.get('/', authMiddleware, async (req, res) => {
    try {
        const caretakers = await prisma.caretaker.findMany({
            where: { patientId: req.user.id },
            include: { caretaker: { select: { phoneNumber: true, email: true } } },
        });
        res.json(caretakers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /caretakers/:id/approve
router.put('/:id/approve', authMiddleware, async (req, res) => {
    try {
        await prisma.caretaker.update({
            where: { id: req.params.id },
            data: { status: 'accepted', acceptedAt: new Date() },
        });
        res.json({ message: 'Caretaker approved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /caretakers/:id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await prisma.caretaker.deleteMany({
            where: { id: req.params.id, patientId: req.user.id },
        });
        res.json({ message: 'Removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
