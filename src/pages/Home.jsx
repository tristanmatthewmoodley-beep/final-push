import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Truck, Clock, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import productService from '../services/productService'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    // Load featured products and stats
    const featured = productService.getFeaturedProducts(4)
    const statistics = productService.getStats()

    setFeaturedProducts(featured)
    setStats(statistics)
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
      <section className="relative bg-gradient-to-r from-car-black to-car-gray py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Premium Car Parts
              <span className="block text-gray-300">& Spares</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover high-quality automotive parts and accessories for all makes and models.
              Your vehicle deserves the best components for optimal performance.
            </p>

            {/* Stats */}
            {stats.totalProducts && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.totalProducts}+</div>
                  <div className="text-sm text-gray-400">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.totalBrands}+</div>
                  <div className="text-sm text-gray-400">Brands</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.totalCategories}+</div>
                  <div className="text-sm text-gray-400">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.averageRating}★</div>
                  <div className="text-sm text-gray-400">Avg Rating</div>
                </div>
              </div>
            )}
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
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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
            {productService.getCategories().slice(1, 9).map((category) => (
              <Link
                key={category}
                to={`/products?category=${category.toLowerCase()}`}
                className="card text-center hover:scale-105 transform transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-white">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
