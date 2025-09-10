import { productsAPI } from './api'

class ProductService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  // Helper method to check cache
  getCachedData(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }
    return null
  }

  // Helper method to set cache
  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  // Get all products
  async getAllProducts(params = {}) {
    try {
      const cacheKey = `products_${JSON.stringify(params)}`
      const cached = this.getCachedData(cacheKey)
      if (cached) return cached

      const response = await productsAPI.getProducts(params)
      if (response.success) {
        this.setCachedData(cacheKey, response.data)
        return response.data
      }
      return { products: [], pagination: {} }
    } catch (error) {
      console.error('Error fetching products:', error)
      return { products: [], pagination: {} }
    }
  }

  // Get products by category
  async getProductsByCategory(category, params = {}) {
    const filterParams = { ...params, category: category === 'all' ? '' : category }
    return await this.getAllProducts(filterParams)
  }

  // Get products by brand
  async getProductsByBrand(brand, params = {}) {
    const filterParams = { ...params, brand }
    return await this.getAllProducts(filterParams)
  }

  // Search products
  async searchProducts(searchTerm, limit = 10) {
    try {
      const response = await productsAPI.searchProducts(searchTerm, limit)
      if (response.success) {
        return response.data.products
      }
      return []
    } catch (error) {
      console.error('Error searching products:', error)
      return []
    }
  }

  // Get product by ID
  async getProductById(id) {
    try {
      const cacheKey = `product_${id}`
      const cached = this.getCachedData(cacheKey)
      if (cached) return cached

      const response = await productsAPI.getProduct(id)
      if (response.success) {
        this.setCachedData(cacheKey, response.data.product)
        return response.data.product
      }
      return null
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  }

  // Get featured products
  async getFeaturedProducts(limit = 8) {
    try {
      const cacheKey = `featured_${limit}`
      const cached = this.getCachedData(cacheKey)
      if (cached) return cached

      const response = await productsAPI.getFeaturedProducts(limit)
      if (response.success) {
        this.setCachedData(cacheKey, response.data.products)
        return response.data.products
      }
      return []
    } catch (error) {
      console.error('Error fetching featured products:', error)
      return []
    }
  }

  // Get products on sale (products with originalPrice > price)
  async getSaleProducts(limit = 6) {
    try {
      const response = await this.getAllProducts({ limit })
      const products = response.products || []
      return products.filter(product =>
        product.originalPrice && product.originalPrice > product.price
      ).slice(0, limit)
    } catch (error) {
      console.error('Error fetching sale products:', error)
      return []
    }
  }

  // Get all unique categories
  async getCategories() {
    try {
      const cacheKey = 'categories'
      const cached = this.getCachedData(cacheKey)
      if (cached) return cached

      const response = await productsAPI.getCategories()
      if (response.success) {
        const categories = ['All Categories', ...response.data.categories.sort()]
        this.setCachedData(cacheKey, categories)
        return categories
      }
      return ['All Categories']
    } catch (error) {
      console.error('Error fetching categories:', error)
      return ['All Categories']
    }
  }

  // Get all unique brands
  async getBrands() {
    try {
      const cacheKey = 'brands'
      const cached = this.getCachedData(cacheKey)
      if (cached) return cached

      const response = await productsAPI.getBrands()
      if (response.success) {
        const brands = response.data.brands.sort()
        this.setCachedData(cacheKey, brands)
        return brands
      }
      return []
    } catch (error) {
      console.error('Error fetching brands:', error)
      return []
    }
  }

  // Filter products with multiple criteria
  async filterProducts(filters) {
    const params = {
      category: filters.category && filters.category !== 'all' ? filters.category : '',
      brand: filters.brand && filters.brand !== 'all' ? filters.brand : '',
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      inStock: filters.inStock,
      search: filters.searchTerm,
      sortBy: filters.sortBy || 'createdAt',
      sortOrder: filters.sortOrder || 'desc'
    }

    return await this.getAllProducts(params)
  }

  // Format currency helper
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount)
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }
}

// Create and export a singleton instance
const productService = new ProductService()
export default productService
