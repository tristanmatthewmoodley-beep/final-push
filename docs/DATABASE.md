# 🗄️ Database Setup Guide

Complete guide for setting up and managing the MongoDB database for MSeries Auto Online Spares.

## 🎯 Database Overview

### Technology Stack
- **Database**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose
- **Environment**: Development & Production

### Database Structure
```
mseries-auto/
├── users/              # User accounts and profiles
├── products/           # Product catalog
├── categories/         # Product categories
├── orders/            # Customer orders (future)
├── reviews/           # Product reviews (future)
└── sessions/          # User sessions
```

## 🚀 MongoDB Atlas Setup

### 1. Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Verify email address

### 2. Create Organization & Project
1. Create organization: "MSeries Auto"
2. Create project: "MSeries Auto Online Spares"
3. Add team members if needed

### 3. Create Database Cluster

#### Free Tier Setup (M0 Sandbox)
1. Click "Build a Database"
2. Choose **FREE** shared cluster
3. Select cloud provider:
   - **AWS** (recommended)
   - **Google Cloud**
   - **Azure**
4. Choose region closest to your users
5. Cluster name: `mseries-auto-cluster`
6. Click "Create Cluster"

#### Production Setup (M2+)
For production, consider upgrading to:
- **M2**: $9/month (2GB RAM, 10GB storage)
- **M5**: $25/month (8GB RAM, 25GB storage)

### 4. Configure Database Access

#### Create Database User
1. Go to "Database Access" → "Add New Database User"
2. Authentication Method: **Password**
3. Username: `mseries-admin`
4. Password: Generate secure password (save it!)
5. Database User Privileges: **Read and write to any database**
6. Click "Add User"

#### Additional Users (Optional)
```
Development User:
- Username: mseries-dev
- Password: [secure-password]
- Privileges: Read and write to any database

Read-Only User:
- Username: mseries-readonly
- Password: [secure-password]
- Privileges: Only read any database
```

### 5. Configure Network Access

#### Development Setup
1. Go to "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (0.0.0.0/0)
3. Comment: "Development access"

#### Production Setup
1. Add specific IP addresses:
   - Your production server IP
   - Your office/home IP for admin access
2. Avoid using 0.0.0.0/0 in production

### 6. Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Driver: **Node.js**
4. Version: **4.1 or later**
5. Copy connection string:
```
mongodb+srv://mseries-admin:<password>@mseries-auto-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## 🔧 Local Development Setup

### 1. Environment Configuration
Create `.env` file in backend directory:
```env
# Database Configuration
MONGODB_URI=mongodb+srv://mseries-admin:your-password@mseries-auto-cluster.xxxxx.mongodb.net/mseries-auto?retryWrites=true&w=majority
DB_NAME=mseries-auto

# Development Database (optional)
MONGODB_URI_DEV=mongodb+srv://mseries-dev:dev-password@mseries-auto-cluster.xxxxx.mongodb.net/mseries-auto-dev?retryWrites=true&w=majority
```

### 2. Database Connection
```javascript
// config/database.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    
    // Log database name
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
```

## 📊 Database Schema

### User Schema
```javascript
// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

export default mongoose.model('User', userSchema);
```

### Product Schema
```javascript
// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  productCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  details: {
    specifications: mongoose.Schema.Types.Mixed,
    features: [String],
    compatibility: [String],
    installation: String,
    warranty: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  seoTitle: String,
  seoDescription: String
}, {
  timestamps: true
});

// Indexes for performance
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ productCode: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
```

## 🌱 Database Seeding

### Seed Script
```javascript
// scripts/seed.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import connectDB from '../config/database.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@mseriesauto.com',
      password: adminPassword,
      role: 'admin',
      emailVerified: true
    });
    
    // Create test user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'user@example.com',
      password: userPassword,
      role: 'customer',
      emailVerified: true
    });
    
    // Create sample products
    const products = [
      {
        name: 'BMW Oil Filter',
        description: 'High-quality oil filter for BMW vehicles',
        price: 24.99,
        originalPrice: 29.99,
        category: 'Engine',
        brand: 'BMW',
        productCode: 'BM001',
        sku: 'MSA-BM001',
        stockQuantity: 50,
        images: [{
          url: 'https://example.com/bmw-oil-filter.jpg',
          alt: 'BMW Oil Filter',
          isPrimary: true
        }],
        isFeatured: true
      },
      // Add more products...
    ];
    
    await Product.insertMany(products);
    
    console.log('✅ Database seeded successfully');
    console.log(`👤 Admin: ${admin.email} / admin123`);
    console.log(`👤 User: ${user.email} / user123`);
    console.log(`📦 Products: ${products.length} created`);
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
```

### Run Seeding
```bash
cd back-end
npm run seed
```

## 🔍 Database Operations

### Common Queries

#### Find Products
```javascript
// Get all active products
const products = await Product.find({ isActive: true });

// Get products by category
const brakeProducts = await Product.find({ 
  category: 'Brakes',
  isActive: true 
});

// Search products
const searchResults = await Product.find({
  $text: { $search: 'brake pads' },
  isActive: true
});

// Get featured products
const featured = await Product.find({ 
  isFeatured: true,
  isActive: true 
}).limit(4);
```

#### User Operations
```javascript
// Find user by email
const user = await User.findOne({ email: 'user@example.com' });

// Update user profile
await User.findByIdAndUpdate(userId, {
  firstName: 'New Name',
  lastLogin: new Date()
});
```

### Aggregation Examples
```javascript
// Get product statistics
const stats = await Product.aggregate([
  { $match: { isActive: true } },
  {
    $group: {
      _id: null,
      totalProducts: { $sum: 1 },
      avgPrice: { $avg: '$price' },
      totalStock: { $sum: '$stockQuantity' }
    }
  }
]);

// Products by category
const categoryStats = await Product.aggregate([
  { $match: { isActive: true } },
  {
    $group: {
      _id: '$category',
      count: { $sum: 1 },
      avgPrice: { $avg: '$price' }
    }
  },
  { $sort: { count: -1 } }
]);
```

## 🔧 Database Maintenance

### Backup Strategy
```bash
# Manual backup
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/mseries-auto"

# Automated backup (MongoDB Atlas)
# Configure in Atlas dashboard:
# 1. Go to "Backup" tab
# 2. Enable "Continuous Cloud Backup"
# 3. Set retention policy
```

### Performance Monitoring
```javascript
// Enable MongoDB profiling
db.setProfilingLevel(2, { slowms: 100 });

// Check slow queries
db.system.profile.find().sort({ ts: -1 }).limit(5);

// Index usage stats
db.products.getIndexes();
db.products.stats();
```

### Index Management
```javascript
// Create indexes
db.products.createIndex({ "name": "text", "description": "text" });
db.products.createIndex({ "category": 1, "brand": 1 });
db.products.createIndex({ "price": 1 });

// Check index usage
db.products.explain("executionStats").find({ category: "Brakes" });
```

## 🚨 Troubleshooting

### Common Issues

#### Connection Problems
```javascript
// Debug connection
mongoose.set('debug', true);

// Connection timeout
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};
```

#### Performance Issues
- Add appropriate indexes
- Use aggregation pipelines
- Implement pagination
- Cache frequent queries

#### Memory Issues
- Limit query results
- Use lean() for read-only queries
- Implement proper pagination

### Monitoring Tools
- MongoDB Atlas built-in monitoring
- MongoDB Compass for GUI
- Mongoose debug mode
- Application performance monitoring

---

**📊 For API documentation, see [API.md](./API.md)**
