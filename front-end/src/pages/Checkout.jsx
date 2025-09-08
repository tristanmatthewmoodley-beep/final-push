import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ArrowLeft, CreditCard, Truck, Shield, MapPin, User, Mail, Phone } from 'lucide-react'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'
import orderService from '../services/orderService'
import toast from 'react-hot-toast'

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phone: yup.string().required('Phone number is required'),
  street: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State/Province is required'),
  zipCode: yup.string().required('ZIP/Postal code is required'),
  paymentMethod: yup.string().required('Payment method is required')
})

const Checkout = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const { items, getCartTotal, getCartItemCount, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.firstName || user?.name?.split(' ')[0] || '',
      lastName: user?.lastName || user?.name?.split(' ')[1] || '',
      phone: user?.phone || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || ''
    }
  })

  const cartTotal = getCartTotal()
  const itemCount = getCartItemCount()

  // Calculate totals using order service
  const totals = orderService.calculateOrderTotals(items)

  const formatPrice = (price) => {
    if (typeof price === 'string') {
      return parseFloat(price.replace('R', '')).toFixed(2)
    }
    return price.toFixed(2)
  }

  const onSubmit = async (data) => {
    setIsProcessing(true)

    try {
      // Prepare shipping address
      const shippingAddress = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: 'South Africa'
      }

      // Format order data
      const orderData = orderService.formatOrderForAPI(
        items,
        shippingAddress,
        null, // billingAddress (same as shipping)
        data.paymentMethod,
        data.customerNotes || ''
      )

      // Validate order data
      const validation = orderService.validateOrderData(orderData)
      if (!validation.isValid) {
        toast.error(validation.errors[0])
        return
      }

      // Create order
      const response = await orderService.createOrder(orderData)

      if (response.success) {
        // Clear cart and redirect
        clearCart()
        toast.success('Order placed successfully!')
        navigate('/order-confirmation', {
          state: {
            order: response.data.order
          }
        })
      } else {
        toast.error(response.message || 'Failed to place order')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
            <p className="text-gray-400 text-lg mb-8">
              Add some products to proceed to checkout.
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/cart" 
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Checkout
          </h1>
          <p className="text-gray-400">
            Complete your order for {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email address
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className={`w-full px-4 py-3 bg-car-gray border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white ${
                        errors.email ? 'border-red-500' : 'border-car-light-gray'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Phone number
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className={`w-full px-4 py-3 bg-car-gray border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white ${
                        errors.phone ? 'border-red-500' : 'border-car-light-gray'
                      }`}
                      placeholder="Enter your phone"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping Information
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        First name
                      </label>
                      <input
                        {...register('firstName')}
                        type="text"
                        className={`w-full px-4 py-3 bg-car-gray border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white ${
                          errors.firstName ? 'border-red-500' : 'border-car-light-gray'
                        }`}
                        placeholder="First name"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Last name
                      </label>
                      <input
                        {...register('lastName')}
                        type="text"
                        className={`w-full px-4 py-3 bg-car-gray border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white ${
                          errors.lastName ? 'border-red-500' : 'border-car-light-gray'
                        }`}
                        placeholder="Last name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Address
                    </label>
                    <input
                      {...register('address')}
                      type="text"
                      className={`w-full px-4 py-3 bg-car-gray border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white ${
                        errors.address ? 'border-red-500' : 'border-car-light-gray'
                      }`}
                      placeholder="Street address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        City
                      </label>
                      <input
                        {...register('city')}
                        type="text"
                        className={`w-full px-4 py-3 bg-car-gray border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white ${
                          errors.city ? 'border-red-500' : 'border-car-light-gray'
                        }`}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Province
                      </label>
                      <select
                        {...register('province')}
                        className={`w-full px-4 py-3 bg-car-gray border rounded-lg text-white focus:outline-none focus:border-white ${
                          errors.province ? 'border-red-500' : 'border-car-light-gray'
                        }`}
                      >
                        <option value="">Select Province</option>
                        <option value="EC">Eastern Cape</option>
                        <option value="FS">Free State</option>
                        <option value="GP">Gauteng</option>
                        <option value="KZN">KwaZulu-Natal</option>
                        <option value="LP">Limpopo</option>
                        <option value="MP">Mpumalanga</option>
                        <option value="NC">Northern Cape</option>
                        <option value="NW">North West</option>
                        <option value="WC">Western Cape</option>
                      </select>
                      {errors.province && (
                        <p className="mt-1 text-sm text-red-500">{errors.province.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Postal Code
                      </label>
                      <input
                        {...register('postalCode')}
                        type="text"
                        className={`w-full px-4 py-3 bg-car-gray border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white ${
                          errors.postalCode ? 'border-red-500' : 'border-car-light-gray'
                        }`}
                        placeholder="Postal code"
                      />
                      {errors.postalCode && (
                        <p className="mt-1 text-sm text-red-500">{errors.postalCode.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center p-4 border border-car-light-gray rounded-lg cursor-pointer hover:border-white transition-colors">
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value="card"
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-white">Credit/Debit Card</div>
                        <div className="text-sm text-gray-400">Visa, Mastercard, American Express</div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-car-light-gray rounded-lg cursor-pointer hover:border-white transition-colors">
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value="eft"
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-white">EFT/Bank Transfer</div>
                        <div className="text-sm text-gray-400">Direct bank transfer</div>
                      </div>
                    </label>
                  </div>
                  {errors.paymentMethod && (
                    <p className="mt-1 text-sm text-red-500">{errors.paymentMethod.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-8">
                <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-car-light-gray rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">🔧</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.name}</p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-white text-sm font-semibold">
                        R{(formatPrice(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-gray-400 text-sm">
                      +{items.length - 3} more items
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-car-light-gray pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">{orderService.formatCurrency(totals.subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">VAT (15%)</span>
                    <span className="text-white">{orderService.formatCurrency(totals.tax)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-white">
                      {totals.shipping === 0 ? 'Free' : orderService.formatCurrency(totals.shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between text-lg font-semibold border-t border-car-light-gray pt-3">
                    <span className="text-white">Total</span>
                    <span className="text-white">{orderService.formatCurrency(totals.total)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : `Place Order - ${orderService.formatCurrency(totals.total)}`}
                </button>

                {/* Security Notice */}
                <div className="mt-4 flex items-center text-sm text-gray-400">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
