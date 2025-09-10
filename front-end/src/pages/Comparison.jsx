import { Link } from 'react-router-dom'
import { BarChart3, ShoppingCart, ArrowLeft, X, Star } from 'lucide-react'
import useComparisonStore from '../store/comparisonStore'
import useCartStore from '../store/cartStore'
import toast from 'react-hot-toast'

const Comparison = () => {
  const { items, removeItem, clearComparison } = useComparisonStore()
  const { addItem: addToCart } = useCartStore()

  const handleAddToCart = (product) => {
    addToCart(product)
    toast.success('Added to cart!')
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
            <BarChart3 className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">No products to compare</h1>
            <p className="text-gray-400 text-lg mb-8">
              Add products to compare their features, specifications, and prices.
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Browse Products
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
            to="/products" 
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Product Comparison
              </h1>
              <p className="text-gray-400">
                Compare {items.length} {items.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearComparison}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-car-gray rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-car-light-gray">
                  <td className="p-4 text-gray-400 font-medium">Product</td>
                  {items.map((product) => (
                    <td key={product.id} className="p-4 text-center min-w-[250px]">
                      <div className="relative">
                        <button
                          onClick={() => handleRemoveItem(product.id)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                        
                        {/* Product Image */}
                        <div className="w-32 h-32 bg-car-light-gray rounded-lg flex items-center justify-center mx-auto mb-3">
                          <span className="text-3xl">🔧</span>
                        </div>
                        
                        <h3 className="text-white font-semibold text-sm mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-400 text-xs">{product.category}</p>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <tr className="border-b border-car-light-gray">
                  <td className="p-4 text-gray-400 font-medium">Price</td>
                  {items.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <span className="text-white font-bold text-lg">{product.price}</span>
                    </td>
                  ))}
                </tr>
                
                {/* Rating Row */}
                <tr className="border-b border-car-light-gray">
                  <td className="p-4 text-gray-400 font-medium">Rating</td>
                  {items.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
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
                    </td>
                  ))}
                </tr>
                
                {/* Category Row */}
                <tr className="border-b border-car-light-gray">
                  <td className="p-4 text-gray-400 font-medium">Category</td>
                  {items.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <span className="text-white">{product.category}</span>
                    </td>
                  ))}
                </tr>
                
                {/* Description Row */}
                <tr className="border-b border-car-light-gray">
                  <td className="p-4 text-gray-400 font-medium">Description</td>
                  {items.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <span className="text-gray-300 text-sm">
                        {product.description || 'No description available'}
                      </span>
                    </td>
                  ))}
                </tr>
                
                {/* Action Row */}
                <tr>
                  <td className="p-4 text-gray-400 font-medium">Action</td>
                  {items.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn-primary inline-flex items-center"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Add More Products */}
        <div className="mt-8 text-center">
          <Link to="/products" className="btn-secondary inline-flex items-center">
            Add More Products to Compare
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Comparison
