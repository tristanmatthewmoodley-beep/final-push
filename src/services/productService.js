import productsData from '../data/products.json'

class ProductService {
  constructor() {
    this.products = productsData
  }

  // Get all products
  getAllProducts() {
    return this.products
  }

  // Get products by category
  getProductsByCategory(category) {
    if (category === 'all' || !category) {
      return this.products
    }
    return this.products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    )
  }

  // Get products by brand
  getProductsByBrand(brand) {
    return this.products.filter(product => 
      product.brand.toLowerCase() === brand.toLowerCase()
    )
  }

  // Search products
  searchProducts(searchTerm) {
    if (!searchTerm) return this.products
    
    const term = searchTerm.toLowerCase()
    return this.products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      product.productCode.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    )
  }

  // Get product by ID
  getProductById(id) {
    return this.products.find(product => product.id === parseInt(id))
  }

  // Get featured products (highest rated)
  getFeaturedProducts(limit = 8) {
    return this.products
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, limit)
  }

  // Get products on sale (random selection for demo)
  getSaleProducts(limit = 6) {
    const shuffled = [...this.products].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, limit)
  }

  // Get all unique categories
  getCategories() {
    const categories = [...new Set(this.products.map(product => product.category))]
    return ['All Categories', ...categories.sort()]
  }

  // Get all unique brands
  getBrands() {
    const brands = [...new Set(this.products.map(product => product.brand))]
    return brands.sort()
  }

  // Filter products with multiple criteria
  filterProducts({ category, brand, minPrice, maxPrice, inStock, searchTerm }) {
    let filtered = this.products

    if (category && category !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    }

    if (brand && brand !== 'all') {
      filtered = filtered.filter(product => 
        product.brand.toLowerCase() === brand.toLowerCase()
      )
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price.replace('$', ''))
        return price >= minPrice
      })
    }

    if (maxPrice !== undefined) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price.replace('$', ''))
        return price <= maxPrice
      })
    }

    if (inStock) {
      filtered = filtered.filter(product => product.inStock)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.productCode.toLowerCase().includes(term)
      )
    }

    return filtered
  }

  // Sort products
  sortProducts(products, sortBy) {
    const sorted = [...products]
    
    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      case 'price-asc':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price.replace('$', ''))
          const priceB = parseFloat(b.price.replace('$', ''))
          return priceA - priceB
        })
      case 'price-desc':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price.replace('$', ''))
          const priceB = parseFloat(b.price.replace('$', ''))
          return priceB - priceA
        })
      case 'rating-desc':
        return sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      case 'rating-asc':
        return sorted.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating))
      default:
        return sorted
    }
  }

  // Get price range
  getPriceRange() {
    const prices = this.products.map(product => parseFloat(product.price.replace('$', '')))
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  }

  // Get product statistics
  getStats() {
    return {
      totalProducts: this.products.length,
      totalCategories: this.getCategories().length - 1, // Exclude "All Categories"
      totalBrands: this.getBrands().length,
      inStockProducts: this.products.filter(p => p.inStock).length,
      averageRating: (this.products.reduce((sum, p) => sum + parseFloat(p.rating), 0) / this.products.length).toFixed(1),
      priceRange: this.getPriceRange()
    }
  }
}

// Create and export a singleton instance
const productService = new ProductService()
export default productService
