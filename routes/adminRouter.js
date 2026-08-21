const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { getDashboardStats, getAllUsers, updateUserStatus } = require('../controllers/adminController');



const router = express.Router();

router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);

router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

router.put('/users/:id/status', authMiddleware, adminMiddleware, updateUserStatus)

module.exports = router