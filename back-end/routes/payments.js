import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import payshapService from '../services/payshap.js';
import Order from '../models/Order.js';

const router = express.Router();

/**
 * PayShap Payment Routes
 * 
 * These routes handle payment processing with PayShap.
 * Make sure to configure PayShap credentials in your .env file.
 */

// Validation middleware for payment creation
const createPaymentValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('currency').isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  body('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('customer.email').isEmail().withMessage('Valid customer email is required'),
  body('customer.name').notEmpty().withMessage('Customer name is required')
];

/**
 * @desc    Create payment intent
 * @route   POST /api/payments/create-intent
 * @access  Private
 */
router.post('/create-intent', authenticate, createPaymentValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { amount, currency, orderId, customer, items } = req.body;

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create payment intent with PayShap
    const paymentIntent = await payshapService.createPaymentIntent({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer,
      items,
      orderId
    });

    // Update order with payment intent ID
    order.paymentIntentId = paymentIntent.id;
    order.paymentStatus = 'pending';
    await order.save();

    res.json({
      success: true,
      message: 'Payment intent created successfully',
      data: {
        paymentIntent: {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
          payment_url: paymentIntent.payment_url,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        }
      }
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent'
    });
  }
});

/**
 * @desc    Confirm payment
 * @route   POST /api/payments/confirm
 * @access  Private
 */
router.post('/confirm', authenticate, async (req, res) => {
  try {
    const { paymentIntentId, paymentMethod } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    // Find order by payment intent ID
    const order = await Order.findOne({ paymentIntentId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Confirm payment with PayShap
    const paymentResult = await payshapService.confirmPayment(paymentIntentId, paymentMethod);

    // Update order based on payment result
    if (paymentResult.status === 'succeeded') {
      order.paymentStatus = 'completed';
      order.status = 'confirmed';
      order.paymentDetails = {
        paymentIntentId: paymentResult.id,
        chargeId: paymentResult.charges.data[0].id,
        receiptUrl: paymentResult.charges.data[0].receipt_url,
        paidAt: new Date()
      };
    } else {
      order.paymentStatus = 'failed';
    }

    await order.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        payment: {
          status: paymentResult.status,
          orderId: order._id,
          receiptUrl: paymentResult.charges.data[0]?.receipt_url
        }
      }
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment'
    });
  }
});

/**
 * @desc    PayShap webhook handler
 * @route   POST /api/payments/webhook
 * @access  Public (but verified)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['payshap-signature'];
    const payload = req.body;

    // Verify webhook signature
    const isValid = payshapService.verifyWebhookSignature(payload, signature);
    if (!isValid) {
      console.error('Invalid PayShap webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(payload);
    console.log('📨 PayShap webhook received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      case 'charge.dispute.created':
        await handleChargeDispute(event.data.object);
        break;
      default:
        console.log(`Unhandled PayShap event type: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('PayShap webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Helper functions for webhook event handling
async function handlePaymentSucceeded(paymentIntent) {
  try {
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
    if (order) {
      order.paymentStatus = 'completed';
      order.status = 'confirmed';
      await order.save();
      console.log(`✅ Order ${order._id} payment confirmed via webhook`);
    }
  } catch (error) {
    console.error('Error handling payment succeeded webhook:', error);
  }
}

async function handlePaymentFailed(paymentIntent) {
  try {
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
    if (order) {
      order.paymentStatus = 'failed';
      await order.save();
      console.log(`❌ Order ${order._id} payment failed via webhook`);
    }
  } catch (error) {
    console.error('Error handling payment failed webhook:', error);
  }
}

async function handleChargeDispute(charge) {
  try {
    // Handle charge disputes
    console.log(`⚠️ Charge dispute created for charge: ${charge.id}`);
    // Add your dispute handling logic here
  } catch (error) {
    console.error('Error handling charge dispute webhook:', error);
  }
}

export default router;
