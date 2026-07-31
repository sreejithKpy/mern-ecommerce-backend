const express = require('express');
const { addCategory, getCategories, getCategoryByID, updatecategory, deleteCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, addCategory);

router.get('/', getCategories);

router.get('/:id', getCategoryByID);

router.put('/:id', authMiddleware, adminMiddleware, updatecategory);

router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory)



module.exports = router  