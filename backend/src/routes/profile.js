const express = require('express');
const prisma = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /profile
router.get('/', authMiddleware, async (req, res) => {
    try {
        const profile = await prisma.healthProfile.findUnique({
            where: { userId: req.user.id },
        });
        const contacts = await prisma.emergencyContact.findMany({ where: { userId: req.user.id } });
        const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { email: true, phoneNumber: true, role: true } });

        res.json({
            ...profile,
            allergies: JSON.parse(profile?.allergies || '[]'),
            chronicConditions: JSON.parse(profile?.chronicConditions || '[]'),
            email: user?.email,
            phoneNumber: user?.phoneNumber,
            role: user?.role,
            emergencyContacts: contacts.map(c => ({
                ...c,
                phoneNumbers: JSON.parse(c.phoneNumbers),
                emails: JSON.parse(c.emails),
            })),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /profile
router.put('/', authMiddleware, async (req, res) => {
    try {
        const { fullName, dob, gender, bloodGroup, heightCm, weightKg, allergies, chronicConditions, primaryDosha, doshaVata, doshaPitta, doshaKapha, email } = req.body;

        if (email) {
            await prisma.user.update({ where: { id: req.user.id }, data: { email } });
        }

        const updated = await prisma.healthProfile.upsert({
            where: { userId: req.user.id },
            update: {
                fullName, dob, gender, bloodGroup, heightCm, weightKg,
                allergies: JSON.stringify(allergies || []),
                chronicConditions: JSON.stringify(chronicConditions || []),
                primaryDosha, doshaVata, doshaPitta, doshaKapha,
            },
            create: {
                userId: req.user.id,
                fullName: fullName || 'User',
                dob, gender, bloodGroup, heightCm, weightKg,
                allergies: JSON.stringify(allergies || []),
                chronicConditions: JSON.stringify(chronicConditions || []),
                primaryDosha, doshaVata, doshaPitta, doshaKapha,
            },
        });

        res.json({ ...updated, allergies: JSON.parse(updated.allergies), chronicConditions: JSON.parse(updated.chronicConditions) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Emergency contacts
router.post('/emergency-contacts', authMiddleware, async (req, res) => {
    try {
        const { name, relation, phoneNumbers, emails, isPrimary } = req.body;
        const contact = await prisma.emergencyContact.create({
            data: {
                userId: req.user.id,
                name,
                relation,
                phoneNumbers: JSON.stringify(phoneNumbers || []),
                emails: JSON.stringify(emails || []),
                isPrimary: isPrimary || false,
            },
        });
        res.status(201).json(contact);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/emergency-contacts/:id', authMiddleware, async (req, res) => {
    try {
        await prisma.emergencyContact.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
