import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Truck, Clock, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import productService from '../services/productService'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        // Load featured products and categories
        const [featured, categoriesList] = await Promise.all([
          productService.getFeaturedProducts(4),
          productService.getCategories()
        ])

        setFeaturedProducts(featured)
        setCategories(categoriesList)
      } catch (error) {
        console.error('Error loading home data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Guaranteed",
      description: "All parts come with manufacturer warranty and quality assurance"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast Shipping",
      description: "Free shipping on orders over $100. Express delivery available"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Expert technical support available around the clock"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-car-black to-car-gray py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6">
              Premium Car Parts
              <span className="block text-gray-300">& Spares</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
              Discover high-quality automotive parts and accessories for all makes and models.
              Your vehicle deserves the best components for optimal performance.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-400">Brands</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">15+</div>
                <div className="text-sm text-gray-400">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.8★</div>
                <div className="text-sm text-gray-400">Avg Rating</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn-primary inline-flex items-center">
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-car-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Products
            </h2>
            <p className="text-gray-400 text-lg">
              Discover our most popular and highly-rated car parts
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton for products
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-48 bg-gray-600 rounded mb-4"></div>
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                </div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/products" className="btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-car-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-400 text-lg">
              Find the right parts for your specific needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="card text-center animate-pulse">
                  <div className="h-6 bg-gray-600 rounded"></div>
                </div>
              ))
            ) : (
              categories.slice(1, 9).map((category) => (
                <Link
                  key={category}
                  to={`/products?category=${category.toLowerCase()}`}
                  className="card text-center hover:scale-105 transform transition-all duration-200"
                >
                  <h3 className="text-lg font-semibold text-white">{category}</h3>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
