const express = require('express');
const { addCategory, getCategories, getCategoryByID, updatecategory, deleteCategory } = require('../controllers/categoryController');

const router = express.Router();

router.post('/category', addCategory);

router.get('/category', getCategories);

router.get('/category/:id', getCategoryByID);

router.put('/category/:id', updatecategory);

router.delete('/category/:id', deleteCategory)



module.exports = router  