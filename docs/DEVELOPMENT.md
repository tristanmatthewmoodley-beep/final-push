# 🛠️ Development Guide

Complete guide for developers working on MSeries Auto Online Spares.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- MongoDB Atlas account
- Code editor (VS Code recommended)

### Development Environment Setup

#### 1. Clone Repository
```bash
git clone https://github.com/tristanmatthewmoodley-beep/final-push.git
cd final-push
```

#### 2. Backend Setup
```bash
cd back-end
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Environment Variables:**
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mseries-auto
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

#### 3. Database Setup
```bash
# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

#### 4. Frontend Setup
```bash
cd ../MSeriesAutoOnlineSpares
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Start development server
npm run dev
```

## 📁 Project Architecture

### Backend Structure
```
back-end/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── productController.js # Product CRUD operations
│   └── userController.js    # User management
├── middleware/
│   ├── auth.js             # JWT authentication
│   ├── admin.js            # Admin authorization
│   └── validation.js       # Input validation
├── models/
│   ├── User.js             # User schema
│   └── Product.js          # Product schema
├── routes/
│   ├── auth.js             # Auth routes
│   ├── products.js         # Product routes
│   └── users.js            # User routes
├── scripts/
│   └── seed.js             # Database seeding
└── server.js               # Main application file
```

### Frontend Structure
```
MSeriesAutoOnlineSpares/
├── public/
│   ├── index.html          # HTML template
│   └── assets/             # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── common/         # Common UI components
│   │   ├── forms/          # Form components
│   │   └── layout/         # Layout components
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Homepage
│   │   ├── Products.jsx    # Product listing
│   │   ├── Login.jsx       # Authentication
│   │   └── admin/          # Admin pages
│   ├── services/           # API services
│   │   ├── api.js          # Axios configuration
│   │   └── productService.js # Product API calls
│   ├── store/              # State management
│   │   ├── authStore.js    # Authentication state
│   │   ├── cartStore.js    # Shopping cart state
│   │   └── wishlistStore.js # Wishlist state
│   ├── utils/              # Utility functions
│   └── App.jsx             # Main app component
└── package.json
```

## 🔧 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ... code changes ...

# Test changes
npm test

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request
```

### 2. Code Standards

#### JavaScript/React Standards
- Use ES6+ features
- Functional components with hooks
- Consistent naming conventions
- JSDoc comments for functions
- PropTypes for component props

#### Example Component:
```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * ProductCard component displays product information
 * @param {Object} product - Product data object
 * @param {Function} onAddToCart - Callback for add to cart
 */
const ProductCard = ({ product, onAddToCart }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(product);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <button 
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
```

### 3. API Development

#### Controller Pattern:
```javascript
// controllers/productController.js
import Product from '../models/Product.js';
import { validationResult } from 'express-validator';

/**
 * Get all products with filtering and pagination
 * @route GET /api/products
 * @access Public
 */
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      brand,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const products = await Product.find(filter)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
```

### 4. State Management

#### Zustand Store Example:
```javascript
// store/cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({
            items: [...items, { ...product, quantity: 1 }]
          });
        }
      },
      
      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.id !== productId)
        });
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
);

export default useCartStore;
```

## 🧪 Testing

### Backend Testing
```bash
cd back-end

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Frontend Testing
```bash
cd MSeriesAutoOnlineSpares

# Run component tests
npm test

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

### Test Examples

#### Backend API Test:
```javascript
// tests/products.test.js
import request from 'supertest';
import app from '../server.js';

describe('Products API', () => {
  test('GET /api/products should return products list', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.products).toBeInstanceOf(Array);
  });
  
  test('POST /api/products should create product (admin only)', async () => {
    const productData = {
      name: 'Test Product',
      price: 99.99,
      category: 'Test',
      brand: 'Test Brand'
    };
    
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(productData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.product.name).toBe(productData.name);
  });
});
```

#### Frontend Component Test:
```javascript
// tests/ProductCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image: 'test-image.jpg'
};

test('renders product information', () => {
  render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
  
  expect(screen.getByText('Test Product')).toBeInTheDocument();
  expect(screen.getByText('$99.99')).toBeInTheDocument();
  expect(screen.getByAltText('Test Product')).toBeInTheDocument();
});

test('calls onAddToCart when button clicked', () => {
  const mockAddToCart = jest.fn();
  render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
  
  fireEvent.click(screen.getByText('Add to Cart'));
  expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
});
```

## 🔍 Debugging

### Backend Debugging
```javascript
// Add debug logging
import debug from 'debug';
const log = debug('mseries:api');

// Use in controllers
log('Processing product request:', req.query);
```

### Frontend Debugging
```javascript
// React DevTools
// Install browser extension

// Debug state changes
useEffect(() => {
  console.log('Cart state changed:', cartItems);
}, [cartItems]);

// Debug API calls
const api = axios.create({
  baseURL: process.env.VITE_API_URL,
});

api.interceptors.request.use(request => {
  console.log('API Request:', request);
  return request;
});
```

## 📊 Performance Optimization

### Backend Optimization
- Database indexing
- Query optimization
- Caching with Redis
- Compression middleware
- Rate limiting

### Frontend Optimization
- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis
- Memoization

## 🔒 Security Best Practices

### Backend Security
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Secure headers

### Frontend Security
- Environment variables
- Secure API calls
- Input sanitization
- Content Security Policy

## 📝 Documentation

### Code Documentation
- JSDoc for functions
- README for each module
- API documentation
- Component documentation

### Commit Messages
```
feat: add new product search functionality
fix: resolve cart quantity update issue
docs: update API documentation
style: format code with prettier
refactor: optimize product query performance
test: add unit tests for auth service
```

---

**🚀 Happy coding! For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**
