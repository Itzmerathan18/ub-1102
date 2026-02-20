const express = require('express');
const prisma = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /medications
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { active } = req.query;
        const where = { userId: req.user.id };
        if (active !== undefined) where.isActive = active === 'true';
        const meds = await prisma.medication.findMany({ where, orderBy: { createdAt: 'desc' } });
        res.json(meds.map(m => ({ ...m, timing: JSON.parse(m.timing) })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /medications
router.post('/', authMiddleware, async (req, res) => {
    try {
        const data = req.body;
        const med = await prisma.medication.create({
            data: {
                userId: req.user.id,
                medicineName: data.medicineName,
                medicineSystem: data.medicineSystem || 'allopathy',
                medicineForm: data.medicineForm || 'tablet',
                dosage: data.dosage,
                dosageUnit: data.dosageUnit,
                frequency: data.frequency,
                timing: JSON.stringify(data.timing || []),
                startDate: data.startDate,
                endDate: data.endDate,
                prescribedBy: data.prescribedBy,
                hospitalClinic: data.hospitalClinic,
                purpose: data.purpose,
                quantityRemaining: data.quantityRemaining,
                isActive: data.isActive !== undefined ? data.isActive : true,
            },
        });

        // Auto-generate low stock alert
        if (data.quantityRemaining && data.quantityRemaining <= 5) {
            await prisma.healthAlert.create({
                data: {
                    userId: req.user.id,
                    alertType: 'medication',
                    severity: 'warning',
                    title: `Low stock: ${data.medicineName}`,
                    message: `Only ${data.quantityRemaining} doses remaining. Please refill soon.`,
                },
            });
        }

        res.status(201).json({ ...med, timing: JSON.parse(med.timing) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /medications/:id
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const data = req.body;
        const med = await prisma.medication.updateMany({
            where: { id: req.params.id, userId: req.user.id },
            data: {
                medicineName: data.medicineName,
                medicineSystem: data.medicineSystem,
                medicineForm: data.medicineForm,
                dosage: data.dosage,
                dosageUnit: data.dosageUnit,
                frequency: data.frequency,
                timing: data.timing ? JSON.stringify(data.timing) : undefined,
                startDate: data.startDate,
                endDate: data.endDate,
                prescribedBy: data.prescribedBy,
                hospitalClinic: data.hospitalClinic,
                purpose: data.purpose,
                quantityRemaining: data.quantityRemaining,
                isActive: data.isActive,
            },
        });
        res.json({ message: 'Updated', count: med.count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /medications/:id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await prisma.medication.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
