# 🚀 MSeriesAuto Deployment Guide

Complete guide for deploying the MSeriesAuto e-commerce platform to production.

## 📋 Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account (already configured)
- Domain name (optional)
- Hosting service (Vercel, Netlify, Railway, etc.)

## 🔧 Environment Setup

### Backend Environment Variables

Your `.env` file is already configured with:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://MSeriesAdmin:JunaidManack10%40@mseries.aad3pgv.mongodb.net/Mseries?retryWrites=true&w=majority&appName=MSeries
JWT_SECRET=your-super-secure-production-jwt-secret-key-2024
JWT_EXPIRE=7d
FRONTEND_URL=https://your-domain.com
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ADMIN_EMAIL=admin@mseriesauto.com
ADMIN_PASSWORD=SecureAdminPassword2024!
```

### Frontend Environment Variables

Update `front-end/.env` for production:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=MseriesAutoOnlineSpares
VITE_APP_DESCRIPTION=Premium Car Parts & Spares
VITE_NODE_ENV=production
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Frontend)

1. **Frontend Deployment:**
   ```bash
   cd front-end
   npm install -g vercel
   vercel
   ```

2. **Follow Vercel prompts:**
   - Link to your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`

3. **Environment Variables in Vercel:**
   - Go to Vercel dashboard → Project → Settings → Environment Variables
   - Add all VITE_ variables

### Option 2: Railway (Recommended for Backend)

1. **Backend Deployment:**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the `back-end` folder as root
   - Railway will auto-detect Node.js

2. **Environment Variables in Railway:**
   - Add all environment variables from your `.env` file
   - Railway will provide a domain like `your-app.railway.app`

### Option 3: Netlify (Alternative for Frontend)

1. **Build and Deploy:**
   ```bash
   cd front-end
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your GitHub repository

## 🔄 Quick Deployment Steps

### 1. Prepare Backend

```bash
cd back-end
npm install
npm run seed  # Populate database
```

### 2. Prepare Frontend

```bash
cd front-end
npm install
npm run build
```

### 3. Test Locally

```bash
# Backend (Terminal 1)
cd back-end
npm start

# Frontend (Terminal 2)
cd front-end
npm run preview
```

## 🛠️ Production Optimizations

### Backend Optimizations

1. **Enable compression** (already configured)
2. **Rate limiting** (already configured)
3. **Security headers** (already configured)
4. **Error handling** (already configured)

### Frontend Optimizations

1. **Code splitting** - Consider implementing for large bundles
2. **Image optimization** - Use WebP format when possible
3. **CDN** - Use for static assets

## 🔐 Security Checklist

- ✅ Environment variables secured
- ✅ JWT secret is strong
- ✅ CORS configured properly
- ✅ Rate limiting enabled
- ✅ Input validation implemented
- ✅ Password hashing enabled

## 📊 Monitoring

### Health Checks

- Backend: `https://your-backend-domain.com/health`
- API Test: `https://your-backend-domain.com/api/test`

### Database

- MongoDB Atlas provides built-in monitoring
- Check connection status in Atlas dashboard

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Update `FRONTEND_URL` in backend `.env`
   - Ensure frontend URL is correct

2. **Database Connection:**
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format

3. **Environment Variables:**
   - Ensure all required variables are set
   - Check for typos in variable names

## 📱 Mobile Testing

Test on various devices:
- iOS Safari
- Android Chrome
- Various screen sizes

## 🎉 Go Live Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Database seeded with initial data
- [ ] Admin account created
- [ ] All environment variables configured
- [ ] HTTPS enabled
- [ ] Domain configured (if applicable)
- [ ] Mobile responsiveness tested
- [ ] Image upload functionality tested

## 📞 Support

Default admin credentials:
- Email: admin@mseriesauto.com
- Password: SecureAdminPassword2024!

Your application is ready for production deployment! 🚀
