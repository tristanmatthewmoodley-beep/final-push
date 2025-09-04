import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, ShoppingCart, Heart, BarChart3, Package, Truck, Shield, Clock, Wrench } from 'lucide-react'
import useCartStore from '../store/cartStore'
import useWishlistStore from '../store/wishlistStore'
import useComparisonStore from '../store/comparisonStore'
import productService from '../services/productService'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  const { addItem: addToCart } = useCartStore()
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore()
  const { addItem: addToComparison, isInComparison, removeItem: removeFromComparison } = useComparisonStore()

  useEffect(() => {
    const productData = productService.getProductById(parseInt(id))
    setProduct(productData)
  }, [id])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    toast.success(`Added ${quantity} item(s) to cart!`)
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      const result = addToWishlist(product)
      toast.success(result.message)
    }
  }

  const handleComparisonToggle = () => {
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

  const formatPrice = (price) => {
    if (typeof price === 'string') {
      return parseFloat(price.replace('R', '')).toFixed(2)
    }
    return price.toFixed(2)
  }

  // Mock additional images for demo
  const productImages = [
    product.image,
    product.image + '&variant=1',
    product.image + '&variant=2'
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/products" 
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
          <nav className="text-sm text-gray-400">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-white">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{product.category}</span>
            <span className="mx-2">/</span>
            <span className="text-white">{product.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg bg-car-light-gray"
              />
            </div>
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-white' : 'border-car-light-gray'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="inline-block bg-car-gray text-white px-3 py-1 rounded-full text-sm mb-2">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <p className="text-gray-400 mb-4">{product.description}</p>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-400'
                    }`}
                  />
                ))}
                <span className="text-white font-medium ml-2">{product.rating}</span>
              </div>
              <span className="text-gray-400">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">R{formatPrice(product.price)}</span>
              <span className="text-gray-400 ml-2">incl. VAT</span>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="flex items-center text-gray-400">
                <Package className="w-4 h-4 mr-2" />
                <span>SKU: {product.sku}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Shield className="w-4 h-4 mr-2" />
                <span>Brand: {product.brand}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                <span>Install: {product.installationTime}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Wrench className="w-4 h-4 mr-2" />
                <span>Difficulty: {product.difficulty}</span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <div className="flex items-center text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>In Stock ({product.stockQuantity} available)</span>
                </div>
              ) : (
                <div className="flex items-center text-red-400">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                  <span>Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <label className="text-white mr-3">Quantity:</label>
                  <div className="flex items-center border border-car-light-gray rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-white hover:bg-car-gray"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-white bg-car-gray">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-white hover:bg-car-gray"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                
                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-lg border transition-colors ${
                    isInWishlist(product.id)
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'border-car-light-gray text-white hover:border-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={handleComparisonToggle}
                  className={`p-3 rounded-lg border transition-colors ${
                    isInComparison(product.id)
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-car-light-gray text-white hover:border-white'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="mt-6 p-4 bg-car-gray rounded-lg">
              <div className="flex items-center text-white mb-2">
                <Truck className="w-5 h-5 mr-2" />
                <span className="font-medium">Shipping Information</span>
              </div>
              <p className="text-gray-400 text-sm">
                Free shipping on orders over R500. Standard delivery 3-5 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="border-b border-car-light-gray">
            <nav className="flex space-x-8">
              {['description', 'specifications', 'reviews', 'installation'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-white text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-white mb-4">Product Description</h3>
                <p className="text-gray-300 mb-4">{product.description}</p>
                <h4 className="text-lg font-medium text-white mb-2">Key Features:</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {product.details?.features?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-car-light-gray">
                      <span className="text-gray-400">Brand</span>
                      <span className="text-white">{product.brand}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-car-light-gray">
                      <span className="text-gray-400">Product Code</span>
                      <span className="text-white">{product.productCode}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-car-light-gray">
                      <span className="text-gray-400">Weight</span>
                      <span className="text-white">{product.details?.weight}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-car-light-gray">
                      <span className="text-gray-400">Dimensions</span>
                      <span className="text-white">{product.details?.dimensions}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-car-light-gray">
                      <span className="text-gray-400">Material</span>
                      <span className="text-white">{product.details?.material}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-car-light-gray">
                      <span className="text-gray-400">Warranty</span>
                      <span className="text-white">{product.details?.warranty}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-car-light-gray">
                      <span className="text-gray-400">Origin</span>
                      <span className="text-white">{product.details?.origin}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-car-light-gray">
                      <span className="text-gray-400">Compatibility</span>
                      <span className="text-white">{product.details?.compatibility}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Customer Reviews</h3>
                <div className="bg-car-gray rounded-lg p-6 text-center">
                  <p className="text-gray-400">Reviews feature coming soon!</p>
                  <p className="text-sm text-gray-500 mt-2">
                    This product has {product.reviews} reviews with an average rating of {product.rating} stars.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'installation' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Installation Guide</h3>
                <div className="bg-car-gray rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <Clock className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-white font-medium">Installation Time</p>
                      <p className="text-gray-400">{product.installationTime}</p>
                    </div>
                    <div className="text-center">
                      <Wrench className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-white font-medium">Difficulty Level</p>
                      <p className="text-gray-400">{product.difficulty}</p>
                    </div>
                    <div className="text-center">
                      <Shield className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-white font-medium">Warranty</p>
                      <p className="text-gray-400">{product.details?.warranty}</p>
                    </div>
                  </div>
                  <p className="text-gray-400">
                    Professional installation recommended. Please consult your vehicle manual or a qualified mechanic for proper installation procedures.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
