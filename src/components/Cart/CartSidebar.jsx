import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import useCartStore from '../../store/cartStore'

const CartSidebar = () => {
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
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

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-car-black border-l border-car-light-gray z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-car-light-gray">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Shopping Cart ({itemCount})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-car-gray rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">Your cart is empty</p>
              <p className="text-gray-500 text-sm">Add some products to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-car-gray rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    {/* Product Image Placeholder */}
                    <div className="w-16 h-16 bg-car-light-gray rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🔧</span>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm mb-1 truncate">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-xs mb-2">{item.category}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 bg-car-light-gray rounded flex items-center justify-center hover:bg-gray-600 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-white" />
                          </button>
                          <span className="text-white text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 bg-car-light-gray rounded flex items-center justify-center hover:bg-gray-600 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-white" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Price */}
                      <div className="mt-2 text-right">
                        <span className="text-white font-semibold">
                          ${(formatPrice(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-car-light-gray p-4 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">Total:</span>
              <span className="text-xl font-bold text-white">${total.toFixed(2)}</span>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2">
              <Link
                to="/cart"
                onClick={closeCart}
                className="w-full btn-secondary text-center block"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="w-full btn-primary text-center block"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CartSidebar
