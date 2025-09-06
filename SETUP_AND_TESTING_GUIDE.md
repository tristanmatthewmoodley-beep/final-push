# MSeriesAuto E-commerce Platform - Setup and Testing Guide

## Overview
This is a complete e-commerce platform for auto parts with a React/Vite frontend and Node.js/Express backend. The system includes user authentication, admin dashboard, product management, and order processing.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Backend Setup

### 1. Install Dependencies
```bash
cd back-end
npm install
```

### 2. Environment Configuration
The `.env` file is already configured for local development. For production, update the following:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure secret key
- `CLOUDINARY_*`: Your Cloudinary credentials for image uploads

### 3. Start MongoDB
Make sure MongoDB is running locally on port 27017, or update the `MONGODB_URI` in `.env` to point to your MongoDB Atlas cluster.

### 4. Seed the Database
```bash
npm run seed
```
This will create:
- Admin user: `admin@mseriesauto.com` / `admin123`
- Sample user: `user@example.com` / `user123`
- Sample products

### 5. Start the Backend Server
```bash
npm run dev
```
The backend will run on http://localhost:5000

## Frontend Setup

### 1. Install Dependencies
```bash
cd front-end/MSeriesAutoOnlineSpares
npm install
```

### 2. Start the Frontend
```bash
npm run dev
```
The frontend will run on http://localhost:5173

## Testing the System

### 1. User Authentication
- **Register**: Create a new user account at `/register`
- **Login**: Login with existing credentials at `/login`
- **Admin Login**: Use `admin@mseriesauto.com` / `admin123`

### 2. Product Management (Admin Only)
1. Login as admin
2. Navigate to Admin Dashboard via user menu
3. Go to "Manage Products"
4. Test:
   - Adding new products
   - Editing existing products
   - Deleting products
   - Filtering and searching

### 3. Order Management
**As User:**
1. Browse products on the homepage or products page
2. Add items to cart
3. Proceed to checkout
4. Fill in shipping information
5. Place order

**As Admin:**
1. Go to "Manage Orders" in admin dashboard
2. View all orders
3. Update order status
4. Add tracking information

### 4. Admin Dashboard
1. Login as admin
2. View dashboard statistics:
   - Total revenue, orders, products, users
   - Order status breakdown
   - Top selling products
   - Recent orders

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/verify` - Verify JWT token

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

## Security Features

### Backend Security
- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation with express-validator
- CORS protection
- Helmet security headers
- Role-based access control

### Frontend Security
- Protected routes for authenticated users
- Admin-only routes
- Token-based authentication
- Automatic token refresh handling

## Testing Checklist

### ✅ Authentication
- [ ] User registration works
- [ ] User login works
- [ ] Admin login works
- [ ] Protected routes redirect to login
- [ ] Admin routes require admin role
- [ ] Logout works properly

### ✅ Product Management
- [ ] Products display correctly
- [ ] Product filtering works
- [ ] Product search works
- [ ] Admin can add products
- [ ] Admin can edit products
- [ ] Admin can delete products
- [ ] Product images display

### ✅ Order Management
- [ ] Users can add items to cart
- [ ] Checkout process works
- [ ] Orders are created successfully
- [ ] Users can view their orders
- [ ] Admin can view all orders
- [ ] Admin can update order status

### ✅ Admin Dashboard
- [ ] Dashboard statistics display
- [ ] Order management works
- [ ] Product management works
- [ ] User management works

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **CORS Errors**
   - Verify frontend URL in backend CORS config
   - Check if both servers are running

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify user credentials

4. **API Errors**
   - Check backend console for errors
   - Verify API endpoints are correct
   - Check network tab in browser dev tools

## Production Deployment

### Backend
1. Set production environment variables
2. Use a production MongoDB instance
3. Configure proper CORS origins
4. Set up SSL/HTTPS
5. Use PM2 or similar for process management

### Frontend
1. Build the production bundle: `npm run build`
2. Deploy to a static hosting service
3. Update API URL environment variable

## Default Credentials
- **Admin**: admin@mseriesauto.com / admin123
- **User**: user@example.com / user123

## Support
For issues or questions, check the console logs and ensure all dependencies are properly installed.
