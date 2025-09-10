import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Load environment variables
dotenv.config();

// Sample products data (converted from front-end JSON)
const sampleProducts = [
  {
    name: "FILTER KIT (AIR/OIL)",
    description: "Rectangle Short Type Air Filter - High quality filter kit for optimal engine performance",
    price: 263.25,
    category: "Engine",
    brand: "NISSAN",
    productCode: "R1701",
    sku: "MSA-R1701",
    barcode: "5991916874550",
    images: [
      {
        url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=200&fit=crop",
        alt: "NISSAN Filter Kit",
        isPrimary: true
      }
    ],
    inStock: true,
    stockQuantity: 25,
    rating: 4.4,
    reviewCount: 8,
    details: {
      warranty: "12 months",
      origin: "OEM Quality",
      weight: "1.2kg",
      dimensions: "25cm x 15cm x 8cm",
      material: "High-grade filter material",
      compatibility: "Compatible with NISSAN vehicles",
      features: [
        "High filtration efficiency",
        "Long lasting",
        "Easy installation",
        "OEM quality"
      ]
    },
    tags: ["Engine", "NISSAN", "Filter", "OEM"],
    installationTime: "30 minutes",
    difficulty: "Beginner",
    isFeatured: true
  },
  {
    name: "Brake Disc Set - Front",
    description: "Premium quality front brake discs for enhanced stopping power and safety",
    price: 850.00,
    originalPrice: 950.00,
    category: "Brakes",
    brand: "BMW",
    productCode: "BD2001",
    sku: "MSA-BD2001",
    barcode: "5991916874551",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
        alt: "BMW Brake Disc Set",
        isPrimary: true
      }
    ],
    inStock: true,
    stockQuantity: 15,
    rating: 4.7,
    reviewCount: 12,
    details: {
      warranty: "24 months",
      origin: "OEM Quality",
      weight: "8.5kg",
      dimensions: "32cm x 32cm x 3cm",
      material: "Cast Iron",
      compatibility: "BMW 3 Series, 5 Series",
      features: [
        "Superior heat dissipation",
        "Reduced brake fade",
        "Precision machined",
        "Corrosion resistant"
      ]
    },
    tags: ["Brakes", "BMW", "Safety", "Performance"],
    installationTime: "90 minutes",
    difficulty: "Intermediate",
    isFeatured: true
  },
  {
    name: "LED Headlight Bulb Set",
    description: "Ultra-bright LED headlight bulbs for improved visibility and modern styling",
    price: 450.00,
    category: "Electrical",
    brand: "UNIVERSAL",
    productCode: "LED001",
    sku: "MSA-LED001",
    barcode: "5991916874552",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=300&h=200&fit=crop",
        alt: "LED Headlight Bulbs",
        isPrimary: true
      }
    ],
    inStock: true,
    stockQuantity: 30,
    rating: 4.5,
    reviewCount: 20,
    details: {
      warranty: "18 months",
      origin: "Premium Quality",
      weight: "0.5kg",
      dimensions: "15cm x 10cm x 5cm",
      material: "Aluminum housing with LED chips",
      compatibility: "Universal fit for most vehicles",
      features: [
        "6000K cool white light",
        "50,000 hour lifespan",
        "Plug and play installation",
        "Energy efficient"
      ]
    },
    tags: ["Electrical", "LED", "Lighting", "Universal"],
    installationTime: "15 minutes",
    difficulty: "Beginner",
    isFeatured: false
  },
  {
    name: "Performance Air Filter",
    description: "High-flow performance air filter for increased horsepower and better engine sound",
    price: 320.00,
    category: "Engine",
    brand: "VOLKSWAGEN",
    productCode: "PAF001",
    sku: "MSA-PAF001",
    barcode: "5991916874553",
    images: [
      {
        url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=200&fit=crop",
        alt: "Performance Air Filter",
        isPrimary: true
      }
    ],
    inStock: true,
    stockQuantity: 20,
    rating: 4.3,
    reviewCount: 15,
    details: {
      warranty: "12 months",
      origin: "Performance Grade",
      weight: "0.8kg",
      dimensions: "30cm x 20cm x 5cm",
      material: "Cotton gauze with aluminum mesh",
      compatibility: "VOLKSWAGEN Golf, Polo, Jetta",
      features: [
        "Increased airflow",
        "Washable and reusable",
        "Performance gains",
        "Enhanced engine sound"
      ]
    },
    tags: ["Engine", "VOLKSWAGEN", "Performance", "Reusable"],
    installationTime: "20 minutes",
    difficulty: "Beginner",
    isFeatured: false
  },
  {
    name: "Shock Absorber Set - Rear",
    description: "Premium rear shock absorbers for improved ride comfort and handling",
    price: 1200.00,
    category: "Suspension",
    brand: "MERCEDES",
    productCode: "SA2001",
    sku: "MSA-SA2001",
    barcode: "5991916874554",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
        alt: "Mercedes Shock Absorbers",
        isPrimary: true
      }
    ],
    inStock: true,
    stockQuantity: 8,
    lowStockThreshold: 10,
    rating: 4.8,
    reviewCount: 6,
    details: {
      warranty: "36 months",
      origin: "OEM Quality",
      weight: "12kg",
      dimensions: "60cm x 15cm x 15cm",
      material: "Steel with hydraulic fluid",
      compatibility: "Mercedes C-Class, E-Class",
      features: [
        "Superior damping",
        "Reduced body roll",
        "Enhanced stability",
        "Long lasting durability"
      ]
    },
    tags: ["Suspension", "MERCEDES", "Comfort", "Handling"],
    installationTime: "120 minutes",
    difficulty: "Advanced",
    isFeatured: true
  },
  {
    name: "Ceramic Brake Pads - Front",
    description: "High-performance ceramic brake pads for superior stopping power and reduced dust",
    price: 380.00,
    originalPrice: 450.00,
    category: "Brakes",
    brand: "AUDI",
    productCode: "CBP001",
    sku: "MSA-CBP001",
    barcode: "5991916874555",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
        alt: "Ceramic Brake Pads",
        isPrimary: true
      }
    ],
    inStock: true,
    stockQuantity: 35,
    rating: 4.6,
    reviewCount: 18,
    details: {
      warranty: "24 months",
      origin: "Premium Quality",
      weight: "2.5kg",
      dimensions: "20cm x 15cm x 3cm",
      material: "Ceramic composite",
      compatibility: "AUDI A3, A4, A6",
      features: [
        "Low dust formula",
        "Quiet operation",
        "Excellent heat resistance",
        "Long lasting performance"
      ]
    },
    tags: ["Brakes", "AUDI", "Ceramic", "Performance"],
    installationTime: "60 minutes",
    difficulty: "Intermediate",
    isFeatured: true
  },
  {
    name: "Engine Oil 5W-30 Synthetic",
    description: "Premium full synthetic engine oil for maximum protection and performance",
    price: 180.00,
    category: "Engine",
    brand: "CASTROL",
    productCode: "EO001",
    sku: "MSA-EO001",
    barcode: "5991916874556",
    images: [
      {
        url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=200&fit=crop",
        alt: "Synthetic Engine Oil",
        isPrimary: true
      }
    ],
    inStock: true,
    stockQuantity: 50,
    rating: 4.7,
    reviewCount: 25,
    details: {
      warranty: "N/A",
      origin: "Premium Grade",
      weight: "4.5kg",
      dimensions: "25cm x 15cm x 30cm",
      material: "Full synthetic oil",
      compatibility: "Most modern engines",
      features: [
        "Superior engine protection",
        "Improved fuel economy",
        "Extended drain intervals",
        "All-weather performance"
      ]
    },
    tags: ["Engine", "Oil", "Synthetic", "Protection"],
    installationTime: "30 minutes",
    difficulty: "Beginner",
    isFeatured: false
  },
  {
    name: "Windshield Wipers - Premium",
    description: "All-season windshield wipers for crystal clear visibility in all weather conditions",
    price: 120.00,
    originalPrice: 150.00,
    category: "Accessories",
    brand: "BOSCH",
    productCode: "WW001",
    sku: "MSA-WW001",
    barcode: "5991916874557",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=300&h=200&fit=crop",
        alt: "Premium Windshield Wipers",
        isPrimary: true
      }
    ],
    inStock: true,
    stockQuantity: 40,
    rating: 4.4,
    reviewCount: 22,
    details: {
      warranty: "12 months",
      origin: "OEM Quality",
      weight: "0.8kg",
      dimensions: "60cm x 5cm x 3cm",
      material: "Natural rubber with steel frame",
      compatibility: "Universal fit for most vehicles",
      features: [
        "All-weather performance",
        "Streak-free wiping",
        "Easy installation",
        "Durable construction"
      ]
    },
    tags: ["Exterior", "Wipers", "Weather", "Universal"],
    installationTime: "10 minutes",
    difficulty: "Beginner",
    isFeatured: false
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🍃 Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({})
    ]);

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: process.env.ADMIN_EMAIL || 'admin@mseriesauto.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      phone: '+27123456789',
      address: {
        street: '123 Admin Street',
        city: 'Cape Town',
        state: 'Western Cape',
        zipCode: '8001',
        country: 'South Africa'
      },
      isActive: true,
      emailVerified: true
    });

    await adminUser.save();
    console.log('✅ Admin user created');

    // Create sample user
    console.log('👤 Creating sample user...');
    const sampleUser = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      phone: '+27987654321',
      address: {
        street: '456 User Avenue',
        city: 'Johannesburg',
        state: 'Gauteng',
        zipCode: '2000',
        country: 'South Africa'
      },
      isActive: true,
      emailVerified: true
    });

    await sampleUser.save();
    console.log('✅ Sample user created');

    // Create products
    console.log('📦 Creating sample products...');
    const products = [];
    
    for (const productData of sampleProducts) {
      const product = new Product({
        ...productData,
        createdBy: adminUser._id
      });
      
      await product.save();
      products.push(product);
    }

    console.log(`✅ Created ${products.length} products`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Default Credentials:');
    console.log(`Admin: ${adminUser.email} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log(`User: ${sampleUser.email} / user123`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
seedDatabase();
