import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    // Get basic counts
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      monthlyOrders,
      weeklyOrders,
      lowStockProducts
    ] = await Promise.all([
      User.countDocuments({ role: 'user', isActive: true }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Product.countDocuments({ 
        isActive: true, 
        $expr: { $lte: ['$stockQuantity', '$lowStockThreshold'] }
      })
    ]);

    // Get revenue statistics
    const revenueStats = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          monthlyRevenue: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', startOfMonth] },
                '$total',
                0
              ]
            }
          },
          weeklyRevenue: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', startOfWeek] },
                '$total',
                0
              ]
            }
          }
        }
      }
    ]);

    // Get order status breakdown
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$total' }
        }
      }
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.total' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalSold: 1,
          revenue: 1,
          image: '$product.images.0.url'
        }
      }
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'firstName lastName email')
      .select('orderNumber total status createdAt customerName')
      .lean();

    const revenue = revenueStats[0] || {
      totalRevenue: 0,
      monthlyRevenue: 0,
      weeklyRevenue: 0
    };

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          pendingOrders,
          monthlyOrders,
          weeklyOrders,
          lowStockProducts,
          ...revenue
        },
        orderStatusStats,
        topProducts,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) {
      filter.$or = [
        { orderNumber: new RegExp(search, 'i') },
        { 'shippingAddress.firstName': new RegExp(search, 'i') },
        { 'shippingAddress.lastName': new RegExp(search, 'i') },
        { 'shippingAddress.email': new RegExp(search, 'i') }
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'firstName lastName email')
      .select('orderNumber total status paymentStatus createdAt customerName items')
      .lean();

    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders: total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, trackingNumber, carrier, adminNotes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status and related fields
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;
    if (adminNotes) order.adminNotes = adminNotes;

    // Set status-specific timestamps
    const now = new Date();
    switch (status) {
      case 'confirmed':
        order.confirmedAt = now;
        break;
      case 'shipped':
        order.shippedAt = now;
        break;
      case 'delivered':
        order.deliveredAt = now;
        break;
      case 'cancelled':
        order.cancelledAt = now;
        // Restore product stock if cancelled
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stockQuantity: item.quantity } }
          );
        }
        break;
    }

    // Add to status history
    order.statusHistory.push({
      status,
      timestamp: now,
      note: adminNotes || `Status updated to ${status}`,
      updatedBy: req.user._id
    });

    await order.save();
    await order.populate('user', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
};

// @desc    Get all products (Admin)
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      brand,
      inStock,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (inStock !== undefined) filter.inStock = inStock === 'true';
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { productCode: new RegExp(search, 'i') },
        { sku: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') }
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy updatedBy', 'firstName lastName')
      .lean();

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts: total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password')
      .lean();

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers: total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};
