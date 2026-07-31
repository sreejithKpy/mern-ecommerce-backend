const express = require('express');
const { addProduct, getProduct, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, addProduct);

router.get('/', getProduct);

router.get('/:id', getProductById);

router.put('/:id', authMiddleware, adminMiddleware, updateProduct);

router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);





module.exports = router