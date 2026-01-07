const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getProducts).post(protect, authorize('seller', 'admin'), createProduct);
router.route('/import').post(protect, authorize('admin', 'seller'), require('../controllers/productController').importExternalProducts);
router.route('/:id').get(getProductById);

module.exports = router;
