const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createOrder, getOrder, getSingleOrder, cancelOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createOrder);

router.get('/', authMiddleware, getOrder);

router.get('/admin', authMiddleware, adminMiddleware, getAllOrders)

router.get('/:id', authMiddleware, getSingleOrder);

router.patch('/:id/cancel', authMiddleware, cancelOrder);

router.patch('/admin/:id/status', authMiddleware, adminMiddleware, updateOrderStatus)




module.exports = router