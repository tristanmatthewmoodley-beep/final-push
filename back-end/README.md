# MSeriesAutoOnlineSpares Backend

A secure Node.js/Express backend API for the MSeriesAutoOnlineSpares e-commerce platform.

## Features

- **Authentication & Authorization**: JWT-based auth with admin/user roles
- **Product Management**: Full CRUD operations for products (admin only)
- **Order Management**: Order creation, tracking, and admin management
- **Security**: Rate limiting, input validation, password hashing
- **Database**: MongoDB with Mongoose ODM

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`

4. Start MongoDB (local or use MongoDB Atlas)

5. Seed the database:
```bash
npm run seed
```

6. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured/list` - Get featured products
- `GET /api/products/meta/categories` - Get categories
- `GET /api/products/meta/brands` - Get brands

### Orders
- `POST /api/orders` - Create new order (authenticated)
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - All orders (admin)
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/products` - All products (admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## Default Credentials

- **Admin**: admin@mseriesauto.com / admin123
- **User**: user@example.com / user123

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers