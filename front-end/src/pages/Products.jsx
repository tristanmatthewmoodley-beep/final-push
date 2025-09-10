import { useState, useEffect } from 'react'
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import productService from '../services/productService'

const Products = () => {
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [showInStockOnly, setShowInStockOnly] = useState(false)

  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    loadProducts()
  }, [selectedCategory, selectedBrand, searchTerm, sortBy, showInStockOnly, priceRange])

  const loadProducts = async () => {
    try {
      setLoading(true)

      // Build filter parameters
      const filters = {
        category: selectedCategory === 'all' ? '' : selectedCategory,
        brand: selectedBrand === 'all' || selectedBrand === 'All Brands' ? '' : selectedBrand,
        search: searchTerm,
        inStock: showInStockOnly ? 'true' : '',
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        sortBy: sortBy.split('-')[0],
        sortOrder: sortBy.split('-')[1] || 'asc'
      }

      const [productsData, categoriesList, brandsList] = await Promise.all([
        productService.filterProducts(filters),
        productService.getCategories(),
        productService.getBrands()
      ])

      setAllProducts(productsData.products || [])
      setFilteredProducts(productsData.products || [])
      setPagination(productsData.pagination || {})
      setCategories(categoriesList)
      setBrands(['All Brands', ...brandsList])
    } catch (error) {
      console.error('Error loading products:', error)
      setFilteredProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Handle filter changes with debouncing for search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        loadProducts()
      }
    }, 500) // 500ms debounce for search

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand)
  }

  const handleSortChange = (sort) => {
    setSortBy(sort)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Car Parts & Spares
          </h1>
          <p className="text-gray-400 text-lg">
            Browse our extensive collection of premium automotive parts
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-car-gray rounded-lg p-4 md:p-6 mb-8">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:gap-4 lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                className="input-field pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full lg:w-auto">
              {/* Category Filter */}
              <select
                className="input-field w-full sm:w-auto"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category === 'All Categories' ? 'all' : category}
                    className="bg-car-gray text-white"
                  >
                    {category}
                  </option>
                ))}
              </select>

              {/* Brand Filter */}
              <select
                className="input-field w-full sm:w-auto"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                {brands.map((brand) => (
                  <option
                    key={brand}
                    value={brand === 'All Brands' ? 'all' : brand}
                    className="bg-car-gray text-white"
                  >
                    {brand}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-car-light-gray rounded-lg p-1 w-full sm:w-auto justify-center">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded flex-1 sm:flex-none ${
                    viewMode === 'grid'
                      ? 'bg-white text-car-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded flex-1 sm:flex-none ${
                    viewMode === 'list'
                      ? 'bg-white text-car-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredProducts.length} of {allProducts.length} products
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-48 bg-gray-600 rounded mb-4"></div>
                <div className="h-4 bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Products
