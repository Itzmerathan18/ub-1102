const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const prisma = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Storage config
const uploadDir = path.join(__dirname, '../../uploads/prescriptions');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path.extname(file.originalname)}`);
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
        if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
        else cb(new Error('Only PDF and image files are allowed'));
    },
});

// POST /prescriptions
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'File required' });
        const { type, notes } = req.body;
        if (!['ayurveda', 'english'].includes(type)) return res.status(400).json({ error: 'Type must be ayurveda or english' });

        const record = await prisma.prescription.create({
            data: {
                userId: req.user.id,
                type,
                fileName: req.file.originalname,
                fileUrl: `/uploads/prescriptions/${req.file.filename}`,
                notes: notes || null,
            },
        });
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /prescriptions?type=ayurveda|english
router.get('/', authMiddleware, async (req, res) => {
    try {
        const where = { userId: req.user.id };
        if (req.query.type) where.type = req.query.type;
        const records = await prisma.prescription.findMany({ where, orderBy: { createdAt: 'desc' } });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /prescriptions/:id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const record = await prisma.prescription.findFirst({ where: { id: req.params.id, userId: req.user.id } });
        if (record) {
            const filePath = path.join(__dirname, '../../', record.fileUrl);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            await prisma.prescription.delete({ where: { id: record.id } });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
