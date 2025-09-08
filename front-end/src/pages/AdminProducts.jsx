import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  AlertTriangle
} from 'lucide-react';
import { adminAPI, productsAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    category: '',
    brand: '',
    inStock: ''
  });
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchMetadata();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllProducts(filters);
      if (response.success) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to load products');
      console.error('Products fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        productsAPI.getCategories(),
        productsAPI.getBrands()
      ]);
      
      if (categoriesRes.success) setCategories(categoriesRes.data.categories);
      if (brandsRes.success) setBrands(brandsRes.data.brands);
    } catch (error) {
      console.error('Metadata fetch error:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await productsAPI.deleteProduct(productId);
      if (response.success) {
        toast.success('Product deleted successfully');
        fetchProducts();
      }
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Delete product error:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const ProductModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      brand: '',
      productCode: '',
      sku: '',
      stockQuantity: '',
      images: [{ url: '', alt: '', isPrimary: true }],
      isFeatured: false,
      details: {
        warranty: '',
        origin: '',
        weight: '',
        dimensions: '',
        material: '',
        compatibility: '',
        features: ['']
      },
      tags: [''],
      installationTime: '',
      difficulty: 'Intermediate'
    });

    useEffect(() => {
      if (editingProduct) {
        setFormData({
          ...editingProduct,
          price: editingProduct.price.toString(),
          originalPrice: editingProduct.originalPrice?.toString() || '',
          stockQuantity: editingProduct.stockQuantity.toString(),
          images: editingProduct.images.length > 0 ? editingProduct.images : [{ url: '', alt: '', isPrimary: true }],
          details: {
            ...editingProduct.details,
            features: editingProduct.details.features.length > 0 ? editingProduct.details.features : ['']
          },
          tags: editingProduct.tags.length > 0 ? editingProduct.tags : ['']
        });
      }
    }, [editingProduct]);

    const generateProductCode = () => {
      const prefix = formData.brand ? formData.brand.substring(0, 2).toUpperCase() : 'PR';
      const random = Math.floor(Math.random() * 9000) + 1000;
      return `${prefix}${random}`;
    };

    const generateSKU = () => {
      const productCode = formData.productCode || generateProductCode();
      return `MSA-${productCode}`;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        // Auto-generate codes if empty
        const finalFormData = {
          ...formData,
          productCode: formData.productCode || generateProductCode(),
          sku: formData.sku || generateSKU()
        };

        const productData = {
          ...finalFormData,
          price: parseFloat(finalFormData.price),
          originalPrice: finalFormData.originalPrice ? parseFloat(finalFormData.originalPrice) : undefined,
          stockQuantity: parseInt(finalFormData.stockQuantity),
          details: {
            ...finalFormData.details,
            features: finalFormData.details.features.filter(f => f.trim())
          },
          tags: finalFormData.tags.filter(t => t.trim())
        };

        let response;
        if (editingProduct) {
          response = await productsAPI.updateProduct(editingProduct._id, productData);
        } else {
          response = await productsAPI.createProduct(productData);
        }

        if (response.success) {
          toast.success(`Product ${editingProduct ? 'updated' : 'created'} successfully`);
          setShowProductModal(false);
          setEditingProduct(null);
          fetchProducts();
        }
      } catch (error) {
        toast.error(`Failed to ${editingProduct ? 'update' : 'create'} product`);
        console.error('Product save error:', error);
      }
    };

    const addFeature = () => {
      setFormData({
        ...formData,
        details: {
          ...formData.details,
          features: [...formData.details.features, '']
        }
      });
    };

    const removeFeature = (index) => {
      const newFeatures = formData.details.features.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        details: {
          ...formData.details,
          features: newFeatures
        }
      });
    };

    const addTag = () => {
      setFormData({
        ...formData,
        tags: [...formData.tags, '']
      });
    };

    const removeTag = (index) => {
      const newTags = formData.tags.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        tags: newTags
      });
    };

    if (!showProductModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-car-gray rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700"
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Engine">Engine</option>
                  <option value="Transmission">Transmission</option>
                  <option value="Brakes">Brakes</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Body Parts">Body Parts</option>
                  <option value="Interior">Interior</option>
                  <option value="Exhaust">Exhaust</option>
                  <option value="Cooling">Cooling</option>
                  <option value="Fuel System">Fuel System</option>
                  <option value="Auto Parts">Auto Parts</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Tools">Tools</option>
                  <option value="Maintenance">Maintenance</option>
                  {categories.filter(cat => !['Engine', 'Transmission', 'Brakes', 'Suspension', 'Electrical', 'Body Parts', 'Interior', 'Exhaust', 'Cooling', 'Fuel System', 'Auto Parts', 'Accessories', 'Tools', 'Maintenance'].includes(cat)).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Price (ZAR) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Product Code *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.productCode}
                    onChange={(e) => setFormData({ ...formData, productCode: e.target.value.toUpperCase() })}
                    className="flex-1 bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
                    placeholder="e.g., R1701"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, productCode: generateProductCode() })}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  SKU *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    className="flex-1 bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
                    placeholder="e.g., MSA-R1701"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sku: generateSKU() })}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  className="w-full bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Original Price (ZAR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
                rows="4"
                required
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Primary Image URL *
              </label>
              <input
                type="url"
                value={formData.images[0]?.url || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  images: [{ url: e.target.value, alt: formData.name, isPrimary: true }]
                })}
                className="w-full bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
                placeholder="https://example.com/image.jpg"
                required
              />
              {formData.images[0]?.url && (
                <div className="mt-2">
                  <img
                    src={formData.images[0].url}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Features
              </label>
              {formData.details.features.map((feature, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...formData.details.features];
                      newFeatures[index] = e.target.value;
                      setFormData({
                        ...formData,
                        details: { ...formData.details, features: newFeatures }
                      });
                    }}
                    className="flex-1 bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
                    placeholder="Enter feature"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="text-car-red hover:text-red-400 text-sm"
              >
                + Add Feature
              </button>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-gray-300">Featured Product</span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-car-red text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                }}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-car-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Product Management</h1>
            <p className="text-gray-400">Manage your product catalog</p>
          </div>
          <button
            onClick={() => setShowProductModal(true)}
            className="bg-car-red text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-car-gray rounded-lg p-6 border border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full bg-car-black border border-gray-600 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-car-red"
              />
            </div>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
              className="bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value, page: 1 })}
              className="bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={filters.inStock}
              onChange={(e) => setFilters({ ...filters, inStock: e.target.value, page: 1 })}
              className="bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
            >
              <option value="">All Stock Status</option>
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>

            <button
              onClick={() => setFilters({ page: 1, limit: 20, search: '', category: '', brand: '', inStock: '' })}
              className="bg-car-red text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-car-gray rounded-lg border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-car-red"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-car-black">
                  <tr>
                    <th className="text-left text-gray-400 py-4 px-6">Product</th>
                    <th className="text-left text-gray-400 py-4 px-6">SKU</th>
                    <th className="text-left text-gray-400 py-4 px-6">Category</th>
                    <th className="text-left text-gray-400 py-4 px-6">Price</th>
                    <th className="text-left text-gray-400 py-4 px-6">Stock</th>
                    <th className="text-left text-gray-400 py-4 px-6">Status</th>
                    <th className="text-left text-gray-400 py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                            {product.images?.[0]?.url ? (
                              <img 
                                src={product.images[0].url} 
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-gray-400 text-sm">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-300">{product.sku}</td>
                      <td className="py-4 px-6 text-gray-300">{product.category}</td>
                      <td className="py-4 px-6 text-white">{formatCurrency(product.price)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-white">{product.stockQuantity}</span>
                          {product.stockQuantity <= product.lowStockThreshold && (
                            <AlertTriangle className="h-4 w-4 text-yellow-400" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowProductModal(true);
                            }}
                            className="text-car-red hover:text-red-400 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-car-black px-6 py-4 flex items-center justify-between">
              <div className="text-gray-400 text-sm">
                Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                {Math.min(pagination.currentPage * filters.limit, pagination.totalProducts)} of{' '}
                {pagination.totalProducts} products
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilters({ ...filters, page: pagination.currentPage - 1 })}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-gray-300">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setFilters({ ...filters, page: pagination.currentPage + 1 })}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductModal />
    </div>
  );
};

export default AdminProducts;
