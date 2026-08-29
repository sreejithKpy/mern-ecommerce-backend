const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistController');

const router = express.Router();

router.get('/', authMiddleware, getWishlist);

router.post('/:productId', authMiddleware, addToWishlist);

router.delete('/:productId', authMiddleware, removeFromWishlist)


module.exports = router;