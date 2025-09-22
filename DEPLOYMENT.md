# Deployment Instructions for Vercel

## Prerequisites
- Vercel account
- Repository connected to Vercel

## Steps to Deploy

### 1. Environment Variables Setup
In your Vercel dashboard, go to your project settings > Environment Variables and add:

```
MONGO_URI=mongodb+srv://yashrajsalunkhe1310_db_user:Yashraj%40111@discovery.jplanph.mongodb.net/discovery
MONGOOSE_DEBUG=false
RAZORPAY_KEY_ID=rzp_test_RJornfC3tXT0YM
RAZORPAY_KEY_SECRET=1UAp2RayhO037nS60nn7oX4f
EMAIL_USER=adityapadale03@gmail.com
EMAIL_PASS=rjrl tzdz vgdy pylu
ADMIN_PASSWORD=admin123
NODE_ENV=production
```

### 2. Build Settings
- Build Command: `npm run build`
- Output Directory: `frontend/dist`
- Install Command: `npm install`

### 3. Domain Configuration
Make sure your vercel.json is properly configured with the API routes.

### 4. Testing
After deployment:
1. Test the main site functionality
2. Go to `/admin` to test the admin panel
3. Login with password: `admin123`

## Troubleshooting

### Admin Panel Not Working
- Check Vercel function logs
- Verify environment variables are set
- Ensure MongoDB connection string is correct

### API Routes Not Working
- Check that vercel.json routes are configured correctly
- Verify serverless function deployment
- Check function logs in Vercel dashboard

## File Structure
```
/
├── vercel.json (deployment config)
├── package.json (root build script)
├── frontend/
│   ├── package.json
│   ├── .env.production
│   └── ... (React app)
└── backend/
    ├── package.json  
    ├── src/index.ts (serverless function)
    └── ... (Express API)
```