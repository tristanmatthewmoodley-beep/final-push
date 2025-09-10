import { ordersAPI } from './api'

class OrderService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 2 * 60 * 1000 // 2 minutes for orders (shorter cache)
  }

  // Helper method to check cache
  getCachedData(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }
    return null
  }

  // Helper method to set cache
  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  // Create new order
  async createOrder(orderData) {
    try {
      const response = await ordersAPI.createOrder(orderData)
      if (response.success) {
        // Clear user orders cache since we have a new order
        this.clearUserOrdersCache()
        return response
      }
      return response
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  // Get user's orders
  async getUserOrders(params = {}) {
    try {
      const cacheKey = `user_orders_${JSON.stringify(params)}`
      const cached = this.getCachedData(cacheKey)
      if (cached) return cached

      const response = await ordersAPI.getUserOrders(params)
      if (response.success) {
        this.setCachedData(cacheKey, response.data)
        return response.data
      }
      return { orders: [], pagination: {} }
    } catch (error) {
      console.error('Error fetching user orders:', error)
      return { orders: [], pagination: {} }
    }
  }

  // Get single order
  async getOrder(orderId) {
    try {
      const cacheKey = `order_${orderId}`
      const cached = this.getCachedData(cacheKey)
      if (cached) return cached

      const response = await ordersAPI.getOrder(orderId)
      if (response.success) {
        this.setCachedData(cacheKey, response.data.order)
        return response.data.order
      }
      return null
    } catch (error) {
      console.error('Error fetching order:', error)
      return null
    }
  }

  // Calculate order totals
  calculateOrderTotals(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.15 // 15% VAT for South Africa
    const shipping = subtotal > 1000 ? 0 : 150 // Free shipping over R1000
    const total = subtotal + tax + shipping

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      total: Math.round(total * 100) / 100
    }
  }

  // Validate order data
  validateOrderData(orderData) {
    const errors = []

    // Check items
    if (!orderData.items || orderData.items.length === 0) {
      errors.push('Order must contain at least one item')
    }

    // Check shipping address
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'zipCode']
    requiredFields.forEach(field => {
      if (!orderData.shippingAddress?.[field]) {
        errors.push(`${field} is required in shipping address`)
      }
    })

    // Check payment method
    if (!orderData.paymentMethod) {
      errors.push('Payment method is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Format order data for API
  formatOrderForAPI(cartItems, shippingAddress, billingAddress, paymentMethod, customerNotes = '') {
    const items = cartItems.map(item => ({
      productId: item.id || item._id,
      quantity: item.quantity,
      price: item.price
    }))

    const totals = this.calculateOrderTotals(cartItems)

    return {
      items,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      customerNotes,
      ...totals
    }
  }

  // Get order status display info
  getOrderStatusInfo(status) {
    const statusMap = {
      pending: {
        label: 'Pending',
        color: 'bg-yellow-600',
        description: 'Order is being processed'
      },
      confirmed: {
        label: 'Confirmed',
        color: 'bg-blue-600',
        description: 'Order has been confirmed'
      },
      processing: {
        label: 'Processing',
        color: 'bg-purple-600',
        description: 'Order is being prepared'
      },
      shipped: {
        label: 'Shipped',
        color: 'bg-indigo-600',
        description: 'Order has been shipped'
      },
      delivered: {
        label: 'Delivered',
        color: 'bg-green-600',
        description: 'Order has been delivered'
      },
      cancelled: {
        label: 'Cancelled',
        color: 'bg-red-600',
        description: 'Order has been cancelled'
      },
      refunded: {
        label: 'Refunded',
        color: 'bg-gray-600',
        description: 'Order has been refunded'
      }
    }

    return statusMap[status] || {
      label: status,
      color: 'bg-gray-600',
      description: 'Unknown status'
    }
  }

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount)
  }

  // Clear user orders cache
  clearUserOrdersCache() {
    for (const key of this.cache.keys()) {
      if (key.startsWith('user_orders_')) {
        this.cache.delete(key)
      }
    }
  }

  // Clear all cache
  clearCache() {
    this.cache.clear()
  }
}

// Create and export a singleton instance
const orderService = new OrderService()
export default orderService
