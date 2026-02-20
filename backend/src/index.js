const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const assessmentRoutes = require('./routes/assessments');
const prescriptionRoutes = require('./routes/prescriptions');
const profileRoutes = require('./routes/profile');
const medicationRoutes = require('./routes/medications');
const reportRoutes = require('./routes/reports');
const alertRoutes = require('./routes/alerts');
const caretakerRoutes = require('./routes/caretakers');
const qrRoutes = require('./routes/qr');
const emergencyRoutes = require('./routes/emergency');

const app = express();
const PORT = process.env.PORT || 4000;

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });

app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Jeevaloom API', timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/assessments', assessmentRoutes);
app.use('/prescriptions', prescriptionRoutes);
app.use('/profile', profileRoutes);
app.use('/medications', medicationRoutes);
app.use('/reports', reportRoutes);
app.use('/alerts', alertRoutes);
app.use('/caretakers', caretakerRoutes);
app.use('/qr', qrRoutes);
app.use('/emergency', emergencyRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🌿 Jeevaloom API running on http://localhost:${PORT}`);
});

module.exports = app;
