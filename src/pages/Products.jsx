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

  useEffect(() => {
    // Load initial data
    const products = productService.getAllProducts()
    const cats = productService.getCategories()
    const brandList = productService.getBrands()
    const priceRangeData = productService.getPriceRange()

    setAllProducts(products)
    setCategories(cats)
    setBrands(['All Brands', ...brandList])
    setPriceRange({ min: 0, max: Math.ceil(priceRangeData.max) })

    // Initial filter
    filterAndSortProducts(products, 'all', 'all', '', 'name-asc', false, 0, Math.ceil(priceRangeData.max))
  }, [])

  const filterAndSortProducts = (products, category, brand, search, sort, inStockOnly, minPrice, maxPrice) => {
    let filtered = productService.filterProducts({
      category: category,
      brand: brand === 'All Brands' ? null : brand,
      searchTerm: search,
      inStock: inStockOnly,
      minPrice: minPrice,
      maxPrice: maxPrice
    })

    filtered = productService.sortProducts(filtered, sort)
    setFilteredProducts(filtered)
  }

  useEffect(() => {
    filterAndSortProducts(
      allProducts,
      selectedCategory,
      selectedBrand,
      searchTerm,
      sortBy,
      showInStockOnly,
      priceRange.min,
      priceRange.max
    )
  }, [selectedCategory, selectedBrand, searchTerm, sortBy, showInStockOnly, priceRange, allProducts])

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
        <div className="bg-car-gray rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                className="input-field pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <select
                className="input-field"
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

              {/* View Mode Toggle */}
              <div className="flex bg-car-light-gray rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid' 
                      ? 'bg-white text-car-black' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
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
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
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
      </div>
    </div>
  )
}

export default Products
