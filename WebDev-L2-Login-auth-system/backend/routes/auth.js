const express = require('express');
const { register, login, dashboard, logout } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/dashboard', requireAuth, dashboard);
router.post('/logout', requireAuth, logout);

module.exports = router;
