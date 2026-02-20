const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const medicationRoutes = require('./routes/medications');
const reportRoutes = require('./routes/reports');
const emergencyRoutes = require('./routes/emergency');
const alertRoutes = require('./routes/alerts');
const caretakerRoutes = require('./routes/caretakers');
const qrRoutes = require('./routes/qr');

const app = express();
const PORT = process.env.PORT || 4000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AyuRaksha LifeVault API', timestamp: new Date().toISOString() });
});

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/medications', medicationRoutes);
app.use('/reports', reportRoutes);
app.use('/emergency', emergencyRoutes);
app.use('/alerts', alertRoutes);
app.use('/caretakers', caretakerRoutes);
app.use('/qr', qrRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🛡 AyuRaksha LifeVault API running on http://localhost:${PORT}`);
});

module.exports = app;
