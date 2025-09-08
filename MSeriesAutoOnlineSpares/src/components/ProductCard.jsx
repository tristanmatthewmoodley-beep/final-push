import { Star, ShoppingCart, Heart, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import useCartStore from '../store/cartStore'
import useWishlistStore from '../store/wishlistStore'
import useComparisonStore from '../store/comparisonStore'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const {
    _id,
    id = _id,
    name,
    price,
    images,
    rating,
    category,
    brand,
    inStock
  } = product

  // Get primary image or first image
  const image = images?.[0]?.url || images?.[0] || '/placeholder-image.jpg'

  // Format price
  const formatPrice = (price) => {
    if (typeof price === 'string' && price.startsWith('R')) {
      return price // Already formatted
    }
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price)
  }
  const { addItem: addToCart, openCart } = useCartStore()
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore()
  const { addItem: addToComparison, isInComparison, removeItem: removeFromComparison } = useComparisonStore()

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart({ ...product, id, image })
    toast.success('Added to cart!')
    openCart()
  }

  const handleWishlistToggle = (e) => {
    e.stopPropagation()
    if (isInWishlist(id)) {
      removeFromWishlist(id)
      toast.success('Removed from wishlist')
    } else {
      const result = addToWishlist({ ...product, id })
      toast.success(result.message)
    }
  }

  const handleComparisonToggle = (e) => {
    e.stopPropagation()
    if (isInComparison(id)) {
      removeFromComparison(id)
      toast.success('Removed from comparison')
    } else {
      const result = addToComparison({ ...product, id })
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    }
  }

  return (
    <div className="card group">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <Link to={`/product/${id}`} className="block">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover bg-car-light-gray group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=200&fit=crop'
            }}
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </Link>

        <div className="absolute top-2 left-2">
          <span className="bg-white text-car-black px-2 py-1 rounded text-xs font-medium">
            {category}
          </span>
        </div>

        <div className="absolute top-2 right-2">
          <span className="bg-car-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
            {brand}
          </span>
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
        <Link to={`/product/${id}`}>
          <h3 className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors">
            {name}
          </h3>
        </Link>

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
          <span className="text-xl font-bold text-white">{formatPrice(price)}</span>
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="bg-white text-car-black p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {/* Stock indicator */}
        <div className="mt-2">
          {inStock ? (
            <span className="text-green-400 text-xs">✓ In Stock</span>
          ) : (
            <span className="text-red-400 text-xs">✗ Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
