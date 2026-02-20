const express = require('express');
const prisma = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /alerts
router.get('/', authMiddleware, async (req, res) => {
    try {
        const alerts = await prisma.healthAlert.findMany({
            where: { userId: req.user.id, isDismissed: false },
            orderBy: { createdAt: 'desc' },
        });
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /alerts/read  - mark all as read
router.put('/read', authMiddleware, async (req, res) => {
    try {
        await prisma.healthAlert.updateMany({
            where: { userId: req.user.id },
            data: { isRead: true },
        });
        res.json({ message: 'All marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /alerts/:id/read
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        await prisma.healthAlert.updateMany({
            where: { id: req.params.id, userId: req.user.id },
            data: { isRead: true },
        });
        res.json({ message: 'Marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /alerts/:id  - dismiss
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await prisma.healthAlert.updateMany({
            where: { id: req.params.id, userId: req.user.id },
            data: { isDismissed: true },
        });
        res.json({ message: 'Dismissed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
