import { Link } from 'react-router-dom'
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import useCartStore from '../store/cartStore'

const Cart = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart,
    getCartTotal, 
    getCartItemCount 
  } = useCartStore()

  const formatPrice = (price) => {
    if (typeof price === 'string') {
      return parseFloat(price.replace('$', '')).toFixed(2)
    }
    return price.toFixed(2)
  }

  const total = getCartTotal()
  const itemCount = getCartItemCount()
  const shipping = total > 100 ? 0 : 15.99
  const finalTotal = total + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
            <p className="text-gray-400 text-lg mb-8">
              Looks like you haven't added any items to your cart yet.
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/products" 
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-400">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="card">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-car-light-gray rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">🔧</span>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">{item.category}</p>
                      <p className="text-white font-semibold">
                        ${formatPrice(item.price)}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-car-light-gray rounded flex items-center justify-center hover:bg-gray-600 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                        <span className="text-white text-lg w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-car-light-gray rounded flex items-center justify-center hover:bg-gray-600 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      
                      {/* Subtotal */}
                      <div className="text-right min-w-[80px]">
                        <p className="text-white font-semibold">
                          ${(formatPrice(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Clear Cart Button */}
            <div className="mt-6">
              <button
                onClick={clearCart}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                {shipping > 0 && (
                  <p className="text-sm text-gray-400">
                    Free shipping on orders over $100
                  </p>
                )}
                
                <div className="border-t border-car-light-gray pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-white">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <Link
                  to="/checkout"
                  className="w-full btn-primary text-center block mt-6"
                >
                  Proceed to Checkout
                </Link>
                
                <Link
                  to="/products"
                  className="w-full btn-secondary text-center block"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
