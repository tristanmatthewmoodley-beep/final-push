import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getCategories,
  getBrands,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validation rules for product creation/update
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  body('brand')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Brand must be between 1 and 100 characters'),
  body('productCode')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Product code is required'),
  body('sku')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('SKU is required'),
  body('stockQuantity')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*.url')
    .optional()
    .isURL()
    .withMessage('Image URL must be valid')
];

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/featured/list', getFeaturedProducts);
router.get('/meta/categories', getCategories);
router.get('/meta/brands', getBrands);
router.get('/:id', getProduct);

// Admin routes
router.post('/', authenticate, requireAdmin, productValidation, createProduct);
router.put('/:id', authenticate, requireAdmin, productValidation, updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

export default router;
