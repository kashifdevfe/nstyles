# Railway Deployment Guide

This guide will help you deploy the Barber Shop application to Railway for free.

## Prerequisites

1. A GitHub account
2. A Railway account (sign up at [railway.app](https://railway.app))
3. Your code pushed to a GitHub repository

## Step 1: Prepare Your Repository

1. Push your code to GitHub if you haven't already:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

## Step 2: Deploy Backend

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway will detect the `backend` folder automatically
6. Click on the service and go to **Settings**

### Backend Environment Variables

Add these environment variables in Railway:

```
DATABASE_URL=<Railway will provide this when you add PostgreSQL>
JWT_SECRET=<generate a strong random string>
FRONTEND_URL=<your-frontend-railway-url>
PORT=4000
```

### Add PostgreSQL Database

1. In your backend service, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will automatically create a `DATABASE_URL` environment variable
3. Copy the `DATABASE_URL` value

### Run Database Migrations

1. Go to your backend service
2. Click on **"Deployments"** tab
3. The migrations will run automatically on first deploy (configured in `railway.json`)

## Step 3: Deploy Frontend

1. In Railway dashboard, click **"New"** → **"GitHub Repo"**
2. Select the same repository
3. Railway will detect the `frontend` folder
4. Go to **Settings** → **Root Directory** and set it to `frontend`

### Frontend Environment Variables

Add this environment variable:

```
NEXT_PUBLIC_GRAPHQL_URL=<your-backend-railway-url>/graphql
```

**Important:** Replace `<your-backend-railway-url>` with your actual backend Railway URL (e.g., `https://your-backend.up.railway.app`)

## Step 4: Configure Domains

### Backend Domain
1. Go to backend service → **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy the domain (e.g., `your-backend.up.railway.app`)

### Frontend Domain
1. Go to frontend service → **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy the domain (e.g., `your-frontend.up.railway.app`)

## Step 5: Update Environment Variables

### Update Backend
Update the `FRONTEND_URL` in backend service:
```
FRONTEND_URL=https://your-frontend.up.railway.app
```

### Update Frontend
Update the `NEXT_PUBLIC_GRAPHQL_URL` in frontend service:
```
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend.up.railway.app/graphql
```

## Step 6: Redeploy

After updating environment variables:
1. Both services will automatically redeploy
2. Wait for deployment to complete
3. Check the logs for any errors

## Step 7: Seed Database (Optional)

To seed the database with initial data:

1. Go to backend service → **Settings** → **Variables**
2. Add a temporary variable or use Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run seed
cd backend
railway run npm run prisma:seed
```

## Troubleshooting

### Backend Issues

1. **Database Connection Error**
   - Check that `DATABASE_URL` is set correctly
   - Verify PostgreSQL service is running
   - Check migration logs

2. **CORS Errors**
   - Verify `FRONTEND_URL` matches your frontend domain exactly
   - Check backend logs for CORS errors

3. **Migration Errors**
   - Check deployment logs
   - Verify `DATABASE_URL` is correct
   - Try running migrations manually via Railway CLI

### Frontend Issues

1. **GraphQL Connection Error**
   - Verify `NEXT_PUBLIC_GRAPHQL_URL` is correct
   - Check that backend is running
   - Verify CORS is configured correctly

2. **Build Errors**
   - Check build logs in Railway
   - Verify all dependencies are in `package.json`
   - Check for environment variable issues

## Railway Free Tier Limits

- **$5 credit per month** (enough for small apps)
- **500 hours of usage** per month
- **Automatic sleep** after inactivity (wakes on request)
- **PostgreSQL database** included

## Monitoring

- Check **Metrics** tab for resource usage
- Monitor **Logs** for errors
- Set up **Alerts** for critical issues

## Cost Optimization

1. Use Railway's sleep feature (services sleep after inactivity)
2. Monitor usage in the dashboard
3. Optimize build times
4. Use environment variables efficiently

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check Railway status: https://status.railway.app

