# 📡 API Documentation

Complete reference for MSeries Auto Online Spares REST API.

## 🔗 Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-backend.railway.app/api`

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📋 API Endpoints

### 🔑 Authentication Routes

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "State",
    "zipCode": "12345",
    "country": "Country"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "jwt_token_here"
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "jwt_token_here"
  }
}
```

### 🛍️ Product Routes

#### Get All Products
```http
GET /products
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `category` (string): Filter by category
- `brand` (string): Filter by brand
- `search` (string): Search in name/description
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `inStock` (boolean): Filter by availability
- `sortBy` (string): Sort field (name, price, createdAt)
- `sortOrder` (string): Sort direction (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "product_id",
        "name": "Brake Pads Set",
        "description": "High-quality brake pads for optimal stopping power",
        "price": 89.99,
        "originalPrice": 120.00,
        "category": "Brakes",
        "brand": "Bosch",
        "productCode": "BP001",
        "sku": "MSA-BP001",
        "stockQuantity": 25,
        "images": [
          {
            "url": "https://example.com/image.jpg",
            "alt": "Brake Pads",
            "isPrimary": true
          }
        ],
        "rating": 4.5,
        "reviewCount": 12,
        "isFeatured": true,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalProducts": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Get Single Product
```http
GET /products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "product_id",
      "name": "Brake Pads Set",
      "description": "High-quality brake pads for optimal stopping power",
      "price": 89.99,
      "category": "Brakes",
      "brand": "Bosch",
      "stockQuantity": 25,
      "images": [...],
      "details": {
        "specifications": {
          "material": "Ceramic",
          "warranty": "2 years"
        },
        "features": [
          "Low noise operation",
          "Extended wear life",
          "Superior stopping power"
        ],
        "compatibility": [
          "BMW 3 Series",
          "BMW 5 Series"
        ]
      }
    }
  }
}
```

#### Get Featured Products
```http
GET /products/featured/list
```

**Query Parameters:**
- `limit` (number): Number of products to return (default: 4)

#### Get Product Categories
```http
GET /products/meta/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    "Engine",
    "Brakes",
    "Suspension",
    "Electrical",
    "Body Parts"
  ]
}
```

#### Get Product Brands
```http
GET /products/meta/brands
```

**Response:**
```json
{
  "success": true,
  "data": [
    "Bosch",
    "BMW",
    "Mercedes",
    "Audi",
    "Volkswagen"
  ]
}
```

#### Search Products
```http
GET /products/search
```

**Query Parameters:**
- `q` (string): Search query
- `category` (string): Filter by category
- `limit` (number): Results limit

### 🔧 Admin Product Routes

> **Note:** All admin routes require authentication and admin role.

#### Create Product
```http
POST /products
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "New Brake Pads",
  "description": "Premium brake pads for luxury vehicles",
  "price": 129.99,
  "originalPrice": 159.99,
  "category": "Brakes",
  "brand": "Bosch",
  "productCode": "BP002",
  "sku": "MSA-BP002",
  "stockQuantity": 50,
  "images": [
    {
      "url": "https://example.com/brake-pads.jpg",
      "alt": "Premium Brake Pads",
      "isPrimary": true
    }
  ],
  "details": {
    "specifications": {
      "material": "Ceramic",
      "warranty": "3 years"
    },
    "features": [
      "Ultra-quiet operation",
      "Extended lifespan",
      "Superior heat dissipation"
    ]
  },
  "isFeatured": true,
  "tags": ["premium", "ceramic", "quiet"]
}
```

#### Update Product
```http
PUT /products/:id
Authorization: Bearer <admin-token>
```

#### Delete Product
```http
DELETE /products/:id
Authorization: Bearer <admin-token>
```

### 👤 User Profile Routes

#### Get User Profile
```http
GET /auth/profile
Authorization: Bearer <user-token>
```

#### Update User Profile
```http
PUT /auth/profile
Authorization: Bearer <user-token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": {
    "street": "456 New St",
    "city": "New City",
    "state": "New State",
    "zipCode": "54321",
    "country": "Country"
  }
}
```

### 🛒 Cart Routes (Future Implementation)

#### Get Cart
```http
GET /cart
Authorization: Bearer <user-token>
```

#### Add to Cart
```http
POST /cart/items
Authorization: Bearer <user-token>
```

#### Update Cart Item
```http
PUT /cart/items/:itemId
Authorization: Bearer <user-token>
```

#### Remove from Cart
```http
DELETE /cart/items/:itemId
Authorization: Bearer <user-token>
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## 🚨 HTTP Status Codes

- `200` - OK: Request successful
- `201` - Created: Resource created successfully
- `400` - Bad Request: Invalid request data
- `401` - Unauthorized: Authentication required
- `403` - Forbidden: Insufficient permissions
- `404` - Not Found: Resource not found
- `409` - Conflict: Resource already exists
- `422` - Unprocessable Entity: Validation failed
- `429` - Too Many Requests: Rate limit exceeded
- `500` - Internal Server Error: Server error

## 🔒 Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 login attempts per 15 minutes per IP
- **Admin Operations**: 50 requests per 15 minutes per user

## 📝 Request/Response Examples

### Create Product Example

**Request:**
```bash
curl -X POST https://your-api.railway.app/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-admin-token" \
  -d '{
    "name": "Premium Oil Filter",
    "description": "High-performance oil filter for luxury vehicles",
    "price": 24.99,
    "category": "Engine",
    "brand": "Mann",
    "productCode": "OF001",
    "sku": "MSA-OF001",
    "stockQuantity": 100,
    "images": [
      {
        "url": "https://example.com/oil-filter.jpg",
        "alt": "Premium Oil Filter",
        "isPrimary": true
      }
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Premium Oil Filter",
      "price": 24.99,
      "category": "Engine",
      "brand": "Mann",
      "productCode": "OF001",
      "sku": "MSA-OF001",
      "stockQuantity": 100,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## 🧪 Testing the API

### Using curl
```bash
# Test health endpoint
curl https://your-api.railway.app/health

# Get products
curl https://your-api.railway.app/api/products

# Login
curl -X POST https://your-api.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mseriesauto.com","password":"admin123"}'
```

### Using Postman
1. Import the API collection
2. Set base URL variable
3. Configure authentication
4. Test all endpoints

---

**📚 For more details, see the [Development Guide](./DEVELOPMENT.md)**
