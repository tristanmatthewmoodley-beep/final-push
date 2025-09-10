# 🚀 Deployment Guide

Complete guide to deploy MSeries Auto Online Spares to production hosting platforms.

## 📋 Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- Domain name (optional)
- Basic understanding of environment variables

## 🗂️ Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Vercel)      │───▶│   (Railway)     │───▶│ (MongoDB Atlas) │
│   React App     │    │   Node.js API   │    │   Cloud DB      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Step-by-Step Deployment

### Phase 1: Database Setup (MongoDB Atlas)

#### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create new project: "MSeries Auto"

#### 2. Create Database Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select cloud provider and region (closest to your users)
4. Cluster name: `mseries-auto-cluster`

#### 3. Configure Database Access
1. Go to "Database Access" → "Add New Database User"
2. Authentication Method: **Password**
3. Username: `mseries-admin`
4. Password: Generate secure password (save it!)
5. Database User Privileges: **Read and write to any database**

#### 4. Configure Network Access
1. Go to "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (0.0.0.0/0)
3. Comment: "Production access"

#### 5. Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Driver: **Node.js**, Version: **4.1 or later**
4. Copy connection string (save for later)

### Phase 2: Backend Deployment (Railway)

#### 1. Prepare Backend for Production
```bash
cd back-end
```

Create production environment file:
```bash
# Create .env.production
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://mseries-admin:<password>@mseries-auto-cluster.xxxxx.mongodb.net/mseries-auto?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### 2. Deploy to Railway
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Choose `back-end` folder as root directory

#### 3. Configure Environment Variables
In Railway dashboard:
1. Go to your project → "Variables"
2. Add all variables from `.env.production`:
   - `NODE_ENV`: `production`
   - `PORT`: `3001`
   - `MONGODB_URI`: (your MongoDB connection string)
   - `JWT_SECRET`: (generate strong secret)
   - `JWT_EXPIRE`: `7d`
   - `FRONTEND_URL`: (will update after frontend deployment)

#### 4. Configure Build Settings
1. Go to "Settings" → "Build"
2. Root Directory: `/back-end`
3. Build Command: `npm install`
4. Start Command: `npm start`

#### 5. Deploy and Test
1. Railway will auto-deploy
2. Get your backend URL: `https://your-app.railway.app`
3. Test: `https://your-app.railway.app/health`

### Phase 3: Frontend Deployment (Vercel)

#### 1. Prepare Frontend for Production
```bash
cd MSeriesAutoOnlineSpares
```

Update environment variables:
```bash
# .env.production
VITE_API_URL=https://your-backend.railway.app/api
```

#### 2. Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Configure project:
   - Framework Preset: **Vite**
   - Root Directory: `MSeriesAutoOnlineSpares`
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### 3. Configure Environment Variables
In Vercel dashboard:
1. Go to Project → "Settings" → "Environment Variables"
2. Add: `VITE_API_URL` = `https://your-backend.railway.app/api`

#### 4. Deploy and Test
1. Vercel will auto-deploy
2. Get your frontend URL: `https://your-app.vercel.app`
3. Test the complete application

### Phase 4: Update Backend CORS

Update Railway backend environment:
1. Go to Railway → Variables
2. Update `FRONTEND_URL`: `https://your-app.vercel.app`
3. Railway will auto-redeploy

## 🔧 Production Optimizations

### Backend Optimizations
```javascript
// Add to server.js for production
if (process.env.NODE_ENV === 'production') {
  // Trust proxy
  app.set('trust proxy', 1);
  
  // Secure cookies
  app.use(session({
    cookie: { secure: true }
  }));
}
```

### Frontend Optimizations
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        }
      }
    }
  }
})
```

## 🌐 Custom Domain Setup

### Frontend Domain (Vercel)
1. Go to Vercel → Project → "Settings" → "Domains"
2. Add your domain: `www.mseriesauto.com`
3. Configure DNS records as instructed
4. SSL certificate auto-generated

### Backend Domain (Railway)
1. Go to Railway → Project → "Settings" → "Domains"
2. Add custom domain: `api.mseriesauto.com`
3. Update DNS CNAME record
4. Update frontend `VITE_API_URL`

## 📊 Monitoring & Analytics

### Backend Monitoring
```javascript
// Add to server.js
app.use('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

### Frontend Analytics
```javascript
// Add Google Analytics
// In index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## 🔒 Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled on all domains
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] JWT secrets are strong
- [ ] Database access restricted
- [ ] Error messages don't expose sensitive data

## 🚨 Troubleshooting

### Common Issues

#### CORS Errors
```javascript
// Update backend CORS
app.use(cors({
  origin: [
    'https://your-app.vercel.app',
    'https://www.mseriesauto.com'
  ]
}));
```

#### Database Connection Issues
1. Check MongoDB Atlas IP whitelist
2. Verify connection string format
3. Ensure database user has correct permissions

#### Build Failures
1. Check Node.js version compatibility
2. Verify all dependencies are in package.json
3. Check for environment-specific code

## 📈 Scaling Considerations

### Database Scaling
- Upgrade MongoDB Atlas tier as needed
- Implement database indexing
- Consider read replicas for high traffic

### Backend Scaling
- Railway auto-scales based on traffic
- Consider implementing caching (Redis)
- Monitor API response times

### Frontend Scaling
- Vercel handles CDN automatically
- Implement code splitting
- Optimize images and assets

## 💰 Cost Estimation

### Free Tier Limits
- **MongoDB Atlas**: 512MB storage, shared cluster
- **Railway**: $5/month after free trial
- **Vercel**: Unlimited personal projects

### Paid Upgrades
- **MongoDB Atlas**: $9/month (M2 cluster)
- **Railway**: $20/month (Pro plan)
- **Vercel**: $20/month (Pro plan)

## 🎯 Go-Live Checklist

- [ ] Database deployed and accessible
- [ ] Backend deployed and responding
- [ ] Frontend deployed and loading
- [ ] All API endpoints working
- [ ] Authentication flow working
- [ ] Admin panel accessible
- [ ] Sample data populated
- [ ] SSL certificates active
- [ ] Custom domains configured (if applicable)
- [ ] Monitoring setup
- [ ] Backup strategy implemented

---

**🎉 Congratulations! Your MSeries Auto platform is now live!**
