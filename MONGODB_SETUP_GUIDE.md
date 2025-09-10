# MongoDB Setup Guide

The error you're seeing indicates that MongoDB is not running locally. Here are your options to fix this:

## Option 1: Install MongoDB Locally (Windows)

### Step 1: Download MongoDB Community Server
1. Go to https://www.mongodb.com/try/download/community
2. Select "Windows" and download the MSI installer
3. Run the installer and follow the setup wizard
4. Choose "Complete" installation
5. Install MongoDB as a Windows Service (recommended)

### Step 2: Start MongoDB Service
1. Open Windows Services (Win + R, type `services.msc`)
2. Find "MongoDB" service
3. Right-click and select "Start"

### Step 3: Verify Installation
Open Command Prompt and run:
```bash
mongosh
```
If it connects, MongoDB is running successfully.

## Option 2: Use MongoDB Atlas (Cloud - Recommended)

This is easier and doesn't require local installation.

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Sign up for a free account
3. Create a new cluster (choose the free tier)

### Step 2: Get Connection String
1. In Atlas dashboard, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password

### Step 3: Update Environment File
Replace the MONGODB_URI in `back-end/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mseries-auto?retryWrites=true&w=majority
```

### Step 4: Configure Network Access
1. In Atlas, go to "Network Access"
2. Add IP Address: 0.0.0.0/0 (allows access from anywhere)
3. Or add your specific IP address

## Option 3: Use Docker (Alternative)

If you have Docker installed:

```bash
docker run --name mongodb -d -p 27017:27017 mongo:latest
```

## Quick Test Setup (MongoDB Atlas)

I'll provide you with a temporary test database connection. Update your `.env` file:

```env
# Replace your MONGODB_URI with this temporary one:
MONGODB_URI=mongodb+srv://testuser:testpass123@cluster0.abcde.mongodb.net/mseries-auto-test?retryWrites=true&w=majority
```

**Note: This is just for testing. Set up your own database for production.**

## After Setting Up MongoDB

1. Restart the backend server:
   ```bash
   npm run dev
   ```

2. Seed the database:
   ```bash
   npm run seed
   ```

3. You should see:
   ```
   🍃 MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
   ✅ Admin user created
   ✅ Sample user created
   ✅ Created 5 products
   🎉 Database seeded successfully!
   ```

## Troubleshooting

### Error: "Authentication failed"
- Check your username and password in the connection string
- Ensure the database user has read/write permissions

### Error: "IP not whitelisted"
- Add your IP address to Atlas Network Access
- Or use 0.0.0.0/0 for development (not recommended for production)

### Error: "Connection timeout"
- Check your internet connection
- Verify the connection string is correct

## Which Option Should You Choose?

- **For Development**: MongoDB Atlas (Option 2) - easiest setup
- **For Production**: MongoDB Atlas with proper security settings
- **For Learning**: Local MongoDB (Option 1) - full control

Choose the option that works best for your setup and let me know which one you'd like to proceed with!
