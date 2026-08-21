const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { addToCart, getCart, updateCartQuantity, removeFromCart, clearCart } = require('../controllers/cartController');

const router = express.Router();


router.post('/', authMiddleware, addToCart);

router.get('/', authMiddleware, getCart);

router.put('/:productId', authMiddleware, updateCartQuantity);

router.delete('/:productId', authMiddleware, removeFromCart);

router.delete('/clear', authMiddleware, clearCart)


module.exports = router