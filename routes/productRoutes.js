const express = require('express');
const { addProduct, getProduct, getProductById } = require('../controllers/productController');

const router = express.Router();

router.post('/', addProduct);

router.get('/', getProduct);

router.get('/:id', getProductById)


module.exports = router