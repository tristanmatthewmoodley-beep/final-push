import { Star, ShoppingCart, Heart, BarChart3 } from 'lucide-react'
import useCartStore from '../store/cartStore'
import useWishlistStore from '../store/wishlistStore'
import useComparisonStore from '../store/comparisonStore'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const { name, price, image, rating, category } = product
  const { addItem: addToCart, openCart } = useCartStore()
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore()
  const { addItem: addToComparison, isInComparison, removeItem: removeFromComparison } = useComparisonStore()

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product)
    toast.success('Added to cart!')
    openCart()
  }

  const handleWishlistToggle = (e) => {
    e.stopPropagation()
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      const result = addToWishlist(product)
      toast.success(result.message)
    }
  }

  const handleComparisonToggle = (e) => {
    e.stopPropagation()
    if (isInComparison(product.id)) {
      removeFromComparison(product.id)
      toast.success('Removed from comparison')
    } else {
      const result = addToComparison(product)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    }
  }

  return (
    <div className="card group cursor-pointer">
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
            {category}
          </span>
        </div>

        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-lg transition-colors ${
              isInWishlist(product.id)
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-car-black hover:bg-white'
            }`}
          >
            <Heart size={16} className={isInWishlist(product.id) ? 'fill-current' : ''} />
          </button>
          <button
            onClick={handleComparisonToggle}
            className={`p-2 rounded-lg transition-colors ${
              isInComparison(product.id)
                ? 'bg-blue-500 text-white'
                : 'bg-white/90 text-car-black hover:bg-white'
            }`}
          >
            <BarChart3 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors">
          {name}
        </h3>

        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={`${
                i < Math.floor(rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-400'
              }`}
            />
          ))}
          <span className="text-sm text-gray-400 ml-2">({rating})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-white">{price}</span>
          <button
            onClick={handleAddToCart}
            className="bg-white text-car-black p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
