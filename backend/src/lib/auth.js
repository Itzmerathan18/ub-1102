const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'jeevaloom-secret';

module.exports = { JWT_SECRET };
