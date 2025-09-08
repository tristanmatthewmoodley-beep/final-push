import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react'
import useWishlistStore from '../store/wishlistStore'
import useCartStore from '../store/cartStore'
import toast from 'react-hot-toast'

const Wishlist = () => {
  const { items, removeItem, clearWishlist, moveToCart } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()

  const handleMoveToCart = (product) => {
    const result = moveToCart(product.id, addToCart)
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const handleRemoveItem = (productId) => {
    const result = removeItem(productId)
    toast.success(result.message)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Your wishlist is empty</h1>
            <p className="text-gray-400 text-lg mb-8">
              Save items you love for later by adding them to your wishlist.
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                My Wishlist
              </h1>
              <p className="text-gray-400">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <div key={product.id} className="card group">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <div className="w-full h-48 bg-car-light-gray flex items-center justify-center">
                  {/* Placeholder for product image */}
                  <div className="text-gray-500 text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-600 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🔧</span>
                    </div>
                    <p className="text-sm">Product Image</p>
                  </div>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-white text-car-black px-2 py-1 rounded text-xs font-medium">
                    {product.category}
                  </span>
                </div>
                
                {/* Remove button */}
                <button
                  onClick={() => handleRemoveItem(product.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">
                  {product.name}
                </h3>
                
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Heart
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-400 ml-2">({product.rating})</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-white">{product.price}</span>
                </div>
                
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wishlist
