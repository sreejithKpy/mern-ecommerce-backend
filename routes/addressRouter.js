const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { addAddress, getAddress, updateAddress, deleteAddress, setDefaultAddress } = require('../controllers/addressController');

const router = express.Router();

router.post('/', authMiddleware, addAddress);

router.get('/', authMiddleware, getAddress);

router.put('/:id', authMiddleware, updateAddress); 

router.delete('/:id', authMiddleware, deleteAddress);

router.patch('/:id/default', authMiddleware, setDefaultAddress)


module.exports = router