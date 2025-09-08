# MSeries Auto Online Spares 🚗

A comprehensive e-commerce platform for automotive parts and accessories, built with React.js frontend and Node.js backend.

## 🌟 Features

### Customer Features
- **Product Catalog**: Browse extensive automotive parts inventory
- **Advanced Search**: Filter by category, brand, price, and availability
- **User Authentication**: Secure registration and login system
- **Shopping Cart**: Add/remove items with persistent storage
- **Wishlist**: Save favorite products for later
- **Product Comparison**: Compare multiple products side-by-side
- **Responsive Design**: Optimized for desktop and mobile devices

### Admin Features
- **Product Management**: Add, edit, delete products with image upload
- **Inventory Control**: Track stock levels and manage availability
- **User Management**: View and manage customer accounts
- **Dashboard Analytics**: Sales insights and performance metrics
- **Order Management**: Process and track customer orders

## 🛠️ Technology Stack

### Frontend
- **React.js 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier available)
- Git installed
- Code editor (VS Code recommended)

### 1. Clone Repository
```bash
git clone https://github.com/tristanmatthewmoodley-beep/final-push.git
cd final-push
```

### 2. Backend Setup
```bash
cd back-end
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string
npm run seed  # Populate database with sample data
npm run dev   # Start backend server
```

### 3. Frontend Setup
```bash
cd ../MSeriesAutoOnlineSpares
npm install
npm run dev   # Start frontend development server
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Admin Login**: admin@mseriesauto.com / admin123
- **Test User**: user@example.com / user123

## 📁 Project Structure

```
final-push/
├── back-end/                 # Node.js backend
│   ├── config/              # Database configuration
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── scripts/            # Database scripts
│   └── server.js           # Main server file
├── MSeriesAutoOnlineSpares/ # React frontend
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   └── utils/          # Utility functions
│   └── package.json        # Frontend dependencies
└── docs/                   # Documentation
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 📚 Documentation

- [**Deployment Guide**](./docs/DEPLOYMENT.md) - Complete hosting instructions
- [**API Documentation**](./docs/API.md) - Backend API reference
- [**Development Guide**](./docs/DEVELOPMENT.md) - Development workflow
- [**Database Setup**](./docs/DATABASE.md) - MongoDB configuration
- [**Testing Guide**](./docs/TESTING.md) - Testing procedures

## 🌐 Deployment Options

### Recommended Hosting Platforms

#### Frontend (React)
- **Vercel** (Recommended) - Zero-config deployment
- **Netlify** - Easy static site hosting
- **GitHub Pages** - Free hosting for public repos

#### Backend (Node.js)
- **Railway** (Recommended) - Simple Node.js hosting
- **Heroku** - Popular platform-as-a-service
- **DigitalOcean App Platform** - Scalable hosting

#### Database
- **MongoDB Atlas** (Recommended) - Managed MongoDB service
- **MongoDB Cloud** - Official MongoDB hosting

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Input validation and sanitization
- Secure HTTP headers with Helmet
- Environment variable protection

## 🧪 Testing

```bash
# Backend tests
cd back-end
npm test

# Frontend tests
cd MSeriesAutoOnlineSpares
npm test
```

## 📈 Performance

- Optimized React components with lazy loading
- Image optimization and compression
- API response caching
- Database indexing for fast queries
- Minified production builds

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

- **Issues**: [GitHub Issues](https://github.com/tristanmatthewmoodley-beep/final-push/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tristanmatthewmoodley-beep/final-push/discussions)
- **Email**: support@mseriesauto.com

## 🎯 Roadmap

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications system
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced inventory management

---

**Built with ❤️ for the automotive community**
