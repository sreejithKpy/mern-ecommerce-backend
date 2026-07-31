const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { addToCart, getCart, updateCartQuantity, removeFromCart, clearCart } = require('../controllers/cartController');

const router = express.Router();


router.post('/', authMiddleware, addToCart);

router.get('/', authMiddleware, getCart);

router.put('/update/:productId', authMiddleware, updateCartQuantity);

router.delete('/remove/:productId', authMiddleware, removeFromCart);

router.delete('/clear', authMiddleware, clearCart)


module.exports = router