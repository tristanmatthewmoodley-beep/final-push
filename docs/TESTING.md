# 🧪 Testing Guide

Comprehensive testing guide for MSeries Auto Online Spares application.

## 🎯 Testing Strategy

### Testing Pyramid
```
    /\
   /  \     E2E Tests (Few)
  /____\    
 /      \   Integration Tests (Some)
/________\  Unit Tests (Many)
```

### Test Types
- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Complete user workflows
- **Performance Tests**: Load and stress testing

## 🛠️ Testing Setup

### Backend Testing Stack
- **Jest**: Testing framework
- **Supertest**: HTTP assertion library
- **MongoDB Memory Server**: In-memory database for testing
- **Factory Bot**: Test data generation

### Frontend Testing Stack
- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **MSW**: API mocking
- **Cypress**: E2E testing

## 🔧 Backend Testing

### Setup Test Environment
```bash
cd back-end
npm install --save-dev jest supertest mongodb-memory-server
```

### Test Configuration
```javascript
// jest.config.js
export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Test Setup
```javascript
// tests/setup.js
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
```

### Unit Tests Examples

#### Model Tests
```javascript
// tests/models/User.test.js
import User from '../../models/User.js';

describe('User Model', () => {
  test('should create user with valid data', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.role).toBe('customer');
  });

  test('should not create user with invalid email', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      password: 'password123'
    };

    const user = new User(userData);
    
    await expect(user.save()).rejects.toThrow();
  });

  test('should hash password before saving', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    const user = new User(userData);
    await user.save();

    expect(user.password).not.toBe('password123');
    expect(user.password.length).toBeGreaterThan(20);
  });
});
```

#### Controller Tests
```javascript
// tests/controllers/auth.test.js
import request from 'supertest';
import app from '../../server.js';
import User from '../../models/User.js';

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    test('should register new user', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
    });

    test('should not register user with existing email', async () => {
      // Create existing user
      await User.create({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'password123'
      });

      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      // Create test user
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(user.email);
      expect(response.body.data.token).toBeDefined();
    });

    test('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
```

#### Product API Tests
```javascript
// tests/controllers/products.test.js
import request from 'supertest';
import app from '../../server.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';

describe('Products API', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    // Create regular user
    const user = await User.create({
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@example.com',
      password: 'password123',
      role: 'customer'
    });

    adminToken = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET);
    userToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  });

  describe('GET /api/products', () => {
    test('should return products list', async () => {
      // Create test products
      await Product.create([
        {
          name: 'Product 1',
          description: 'Description 1',
          price: 99.99,
          category: 'Engine',
          brand: 'Brand1',
          productCode: 'P001',
          sku: 'MSA-P001',
          stockQuantity: 10
        },
        {
          name: 'Product 2',
          description: 'Description 2',
          price: 149.99,
          category: 'Brakes',
          brand: 'Brand2',
          productCode: 'P002',
          sku: 'MSA-P002',
          stockQuantity: 5
        }
      ]);

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
    });

    test('should filter products by category', async () => {
      await Product.create([
        {
          name: 'Engine Product',
          description: 'Engine part',
          price: 99.99,
          category: 'Engine',
          brand: 'Brand1',
          productCode: 'E001',
          sku: 'MSA-E001',
          stockQuantity: 10
        },
        {
          name: 'Brake Product',
          description: 'Brake part',
          price: 149.99,
          category: 'Brakes',
          brand: 'Brand2',
          productCode: 'B001',
          sku: 'MSA-B001',
          stockQuantity: 5
        }
      ]);

      const response = await request(app)
        .get('/api/products?category=Engine')
        .expect(200);

      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].category).toBe('Engine');
    });
  });

  describe('POST /api/products', () => {
    test('should create product as admin', async () => {
      const productData = {
        name: 'New Product',
        description: 'New product description',
        price: 199.99,
        category: 'Engine',
        brand: 'TestBrand',
        productCode: 'NP001',
        sku: 'MSA-NP001',
        stockQuantity: 20
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.product.name).toBe(productData.name);

      // Verify product was created
      const product = await Product.findOne({ productCode: 'NP001' });
      expect(product).toBeTruthy();
    });

    test('should not create product as regular user', async () => {
      const productData = {
        name: 'New Product',
        description: 'New product description',
        price: 199.99,
        category: 'Engine',
        brand: 'TestBrand',
        productCode: 'NP001',
        sku: 'MSA-NP001',
        stockQuantity: 20
      };

      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(productData)
        .expect(403);
    });
  });
});
```

### Run Backend Tests
```bash
cd back-end

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- auth.test.js
```

## 🎨 Frontend Testing

### Setup Test Environment
```bash
cd MSeriesAutoOnlineSpares
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
```

### Test Configuration
```javascript
// jest.config.js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/tests/**',
  ],
};
```

### Test Setup
```javascript
// src/tests/setup.js
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
```

### API Mocking
```javascript
// src/tests/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          products: [
            {
              _id: '1',
              name: 'Test Product',
              price: 99.99,
              category: 'Engine',
              brand: 'TestBrand'
            }
          ],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalProducts: 1
          }
        }
      })
    );
  }),

  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            role: 'customer'
          },
          token: 'fake-jwt-token'
        }
      })
    );
  }),
];
```

### Component Tests
```javascript
// src/tests/components/ProductCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

const mockProduct = {
  _id: '1',
  name: 'Test Product',
  price: 99.99,
  images: [{ url: 'test-image.jpg', alt: 'Test Product' }],
  category: 'Engine',
  brand: 'TestBrand',
  inStock: true
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  test('renders product information', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('R99.99')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  test('calls onAddToCart when add to cart button is clicked', () => {
    const mockAddToCart = jest.fn();
    renderWithRouter(
      <ProductCard product={mockProduct} onAddToCart={mockAddToCart} />
    );

    const addButton = screen.getByText('Add to Cart');
    fireEvent.click(addButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  test('shows out of stock when product is not in stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    renderWithRouter(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});
```

### Page Tests
```javascript
// src/tests/pages/Home.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Home Page', () => {
  test('renders hero section', () => {
    renderWithRouter(<Home />);

    expect(screen.getByText(/MSeries Auto/i)).toBeInTheDocument();
    expect(screen.getByText(/Online Spares/i)).toBeInTheDocument();
  });

  test('loads and displays featured products', async () => {
    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  test('displays loading state initially', () => {
    renderWithRouter(<Home />);

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });
});
```

### Run Frontend Tests
```bash
cd MSeriesAutoOnlineSpares

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

## 🌐 E2E Testing with Cypress

### Setup Cypress
```bash
cd MSeriesAutoOnlineSpares
npm install --save-dev cypress
```

### Cypress Configuration
```javascript
// cypress.config.js
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});
```

### E2E Test Examples
```javascript
// cypress/e2e/auth.cy.js
describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should login successfully', () => {
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="email-input"]').type('admin@mseriesauto.com');
    cy.get('[data-testid="password-input"]').type('admin123');
    cy.get('[data-testid="submit-button"]').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="error-message"]').should('be.visible');
  });
});

// cypress/e2e/products.cy.js
describe('Product Management', () => {
  beforeEach(() => {
    // Login as admin
    cy.login('admin@mseriesauto.com', 'admin123');
    cy.visit('/admin/products');
  });

  it('should create new product', () => {
    cy.get('[data-testid="add-product-button"]').click();
    
    cy.get('[data-testid="product-name"]').type('Test Product');
    cy.get('[data-testid="product-price"]').type('99.99');
    cy.get('[data-testid="product-category"]').select('Engine');
    cy.get('[data-testid="product-brand"]').type('TestBrand');
    
    cy.get('[data-testid="submit-button"]').click();
    
    cy.get('[data-testid="success-message"]').should('be.visible');
    cy.get('[data-testid="products-table"]').should('contain', 'Test Product');
  });
});
```

### Custom Cypress Commands
```javascript
// cypress/support/commands.js
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { email, password }
  }).then((response) => {
    window.localStorage.setItem('auth-storage', JSON.stringify({
      state: {
        user: response.body.data.user,
        token: response.body.data.token,
        isAuthenticated: true
      }
    }));
  });
});
```

## 📊 Test Coverage

### Coverage Reports
```bash
# Backend coverage
cd back-end
npm run test:coverage

# Frontend coverage
cd MSeriesAutoOnlineSpares
npm run test:coverage
```

### Coverage Thresholds
```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

## 🚀 Continuous Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd back-end && npm ci
      - name: Run tests
        run: cd back-end && npm test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd MSeriesAutoOnlineSpares && npm ci
      - name: Run tests
        run: cd MSeriesAutoOnlineSpares && npm test
```

---

**🎯 For deployment testing, see [DEPLOYMENT.md](./DEPLOYMENT.md)**
