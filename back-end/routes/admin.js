import express from 'express';
import { body } from 'express-validator';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  getAllUsers
} from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticate, requireAdmin);

// Validation for order status update
const orderStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
    .withMessage('Invalid order status'),
  body('trackingNumber')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Tracking number must be between 1 and 100 characters'),
  body('carrier')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Carrier must be between 1 and 100 characters'),
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Admin notes cannot exceed 1000 characters')
];

// Dashboard routes
router.get('/dashboard', getDashboardStats);

// Order management routes
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', orderStatusValidation, updateOrderStatus);

// Product management routes
router.get('/products', getAllProducts);

// User management routes
router.get('/users', getAllUsers);

export default router;
