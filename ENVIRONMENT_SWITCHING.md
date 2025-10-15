# Environment Switching Guide for EHR Eezy

## 🔄 How to Switch Between Local and Production

### Method 1: Environment Variable (Recommended)
Edit the `.env` file in your frontend folder:

**For LOCAL development:**
```properties
# Uncomment this line and comment the production line
VITE_API_URL=http://localhost:8000/api

# Comment this line when using local
# VITE_API_URL=https://ehr-eezy-backend-production.up.railway.app/api

VITE_APP_ENV=development
```

**For PRODUCTION:**
```properties
# Comment this line when using production
# VITE_API_URL=http://localhost:8000/api

# Uncomment this line for production
VITE_API_URL=https://ehr-eezy-backend-production.up.railway.app/api

VITE_APP_ENV=production
```

### Method 2: Auto-Detection (Smart Default)
If you don't set `VITE_API_URL` at all, the system will automatically:
- Use `http://localhost:8000/api` when running on localhost
- Use `https://ehr-eezy-backend-production.up.railway.app/api` when running on production domain

### Method 3: Quick Toggle Files
You can create two separate environment files:

**`.env.local`** (for local development):
```properties
VITE_API_URL=http://localhost:8000/api
VITE_APP_ENV=development
VITE_APP_NAME=EHR Eezy
```

**`.env.production`** (for production):
```properties
VITE_API_URL=https://ehr-eezy-backend-production.up.railway.app/api
VITE_APP_ENV=production
VITE_APP_NAME=EHR Eezy
```

Then copy the appropriate file to `.env` when you want to switch:
```bash
# Switch to local
cp .env.local .env

# Switch to production  
cp .env.production .env
```

## 🚀 Testing Your Setup

### 1. Check Console Logs
When you open your frontend, look for this log in the browser console:
```
🔗 API URL: http://localhost:8000/api
```
or
```
🔗 API URL: https://ehr-eezy-backend-production.up.railway.app/api
```

### 2. Test Authentication
Try logging in - if it works, your backend connection is correct.

### 3. Check Network Tab
In browser dev tools > Network tab, look at the API requests to see which URL they're going to.

## 🛠 Development Workflow

### For Local Development:
1. Start your local backend: `php artisan serve` (in backend folder)
2. Set frontend to use local: Edit `.env` to use `http://localhost:8000/api`
3. Start frontend: `npm run dev` (in frontend folder)
4. Both should be running and connected

### For Production Testing:
1. Set frontend to use production: Edit `.env` to use Railway URL
2. Start frontend: `npm run dev` (in frontend folder)  
3. Frontend will connect to Railway backend in the cloud

### For Deployment:
1. Make sure `.env` uses production URL
2. Build frontend: `npm run build`
3. Deploy built files to your hosting service

## 🔍 Troubleshooting

### If Local Backend Doesn't Work:
- Check if `php artisan serve` is running
- Verify it's running on port 8000
- Check for any error messages in the backend terminal

### If Production Backend Doesn't Work:
- Check Railway dashboard to see if backend service is running
- Look for deployment errors in Railway logs
- Verify the Railway URL is correct

### Network/CORS Issues:
- Check browser console for CORS errors
- Verify backend CORS settings allow your frontend domain
- Make sure backend is configured for the correct environment