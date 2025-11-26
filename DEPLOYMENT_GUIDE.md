# 🚀 Deployment Guide: Railway + Vercel

This guide will help you deploy your Barber Shop application:
- **Backend** → Railway (with PostgreSQL)
- **Frontend** → Vercel (optimized for Next.js)

---

## 📋 Prerequisites

1. ✅ GitHub repository (already done: `kashifdevfe/nstyles`)
2. Railway account: [railway.app](https://railway.app)
3. Vercel account: [vercel.com](https://vercel.com)

---

## 🔧 Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account & Project

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository: `kashifdevfe/nstyles`
6. Railway will auto-detect the `backend` folder

### 1.2 Add PostgreSQL Database

1. In your Railway project, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway automatically creates `DATABASE_URL` environment variable
3. Copy the `DATABASE_URL` value (you'll need it later)

### 1.3 Configure Backend Environment Variables

Go to your backend service → **Settings** → **Variables** and add:

```env
DATABASE_URL=<auto-created-by-railway>
JWT_SECRET=<generate-using-command-below>
FRONTEND_URL=<will-update-after-vercel-deploy>
PORT=4000
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as `JWT_SECRET`.

### 1.4 Generate Backend Domain

1. Go to backend service → **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy the domain (e.g., `your-backend.up.railway.app`)
4. Save this URL - you'll need it for the frontend!

### 1.5 Verify Backend Deployment

- Check logs in Railway dashboard
- Visit: `https://your-backend.up.railway.app/health` (if health endpoint exists)
- Or test GraphQL: `https://your-backend.up.railway.app/graphql`

---

## 🎨 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account & Project

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your repository: `kashifdevfe/nstyles`
5. Vercel will auto-detect Next.js

### 2.2 Configure Frontend Settings

In the project settings:

1. **Root Directory:** Set to `frontend`
   - Click **"Edit"** next to Root Directory
   - Enter: `frontend`
   - Click **"Save"**

2. **Framework Preset:** Should auto-detect as "Next.js"
3. **Build Command:** `npm run build` (auto-detected)
4. **Output Directory:** `.next` (auto-detected)

### 2.3 Add Environment Variable

Go to **Settings** → **Environment Variables** and add:

```env
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend.up.railway.app/graphql
```

**Important:** Replace `your-backend.up.railway.app` with your actual Railway backend URL!

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (usually 2-3 minutes)
3. Vercel will provide a deployment URL (e.g., `your-app.vercel.app`)

### 2.5 Get Production Domain

After deployment:
1. Go to **Settings** → **Domains**
2. Your default domain: `your-app.vercel.app`
3. (Optional) Add custom domain if you have one

---

## 🔄 Step 3: Update Backend CORS

Now that you have your Vercel frontend URL:

1. Go back to Railway → Backend service → **Settings** → **Variables**
2. Update `FRONTEND_URL`:
   ```env
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Railway will automatically redeploy

---

## 🌱 Step 4: Seed Database (Optional)

To add initial admin and barber accounts:

### Option A: Using Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
cd backend
railway link

# Run seed
railway run npm run prisma:seed
```

### Option B: Using Railway Dashboard

1. Go to backend service → **Settings** → **Variables**
2. Temporarily add: `RUN_SEED=true`
3. Or use Railway's one-click command runner

---

## ✅ Step 5: Verify Everything Works

1. **Backend Health:**
   - Check Railway logs for successful startup
   - Test GraphQL endpoint

2. **Frontend:**
   - Visit your Vercel URL
   - Try logging in with default credentials:
     - **Admin:** `admin@barber.com` / `admin123`
     - **Barber:** `john@barber.com` / `barber123`

3. **Full Flow:**
   - Login → Dashboard → Create entries → Verify data persists

---

## 🔐 Default Login Credentials

**Admin:**
- Email: `admin@barber.com`
- Password: `admin123`

**Barber:**
- Email: `john@barber.com`
- Password: `barber123`

---

## 📝 Environment Variables Summary

### Railway (Backend)
```env
DATABASE_URL=<auto-created>
JWT_SECRET=<your-generated-secret>
FRONTEND_URL=https://your-app.vercel.app
PORT=4000
```

### Vercel (Frontend)
```env
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend.up.railway.app/graphql
```

---

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error:**
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL service is running in Railway
- Review migration logs in Railway dashboard

**CORS Errors:**
- Ensure `FRONTEND_URL` matches your Vercel domain exactly
- Check backend logs for CORS errors
- Verify no trailing slashes in URLs

**Migration Errors:**
- Check Railway deployment logs
- Verify `DATABASE_URL` format is correct
- Try redeploying the backend service

### Frontend Issues

**GraphQL Connection Error:**
- Verify `NEXT_PUBLIC_GRAPHQL_URL` is correct
- Check that backend is running (visit backend URL)
- Verify CORS is configured correctly on backend
- Check browser console for errors

**Build Errors:**
- Check Vercel build logs
- Verify all dependencies are in `package.json`
- Check for missing environment variables
- Ensure `NEXT_PUBLIC_GRAPHQL_URL` is set

**404 Errors:**
- Verify Root Directory is set to `frontend` in Vercel
- Check `next.config.js` for any routing issues

---

## 💰 Free Tier Limits

### Railway
- **$5 credit/month** (enough for small apps)
- **500 hours** of usage per month
- **Automatic sleep** after inactivity (wakes on request)
- **PostgreSQL database** included

### Vercel
- **Unlimited** personal projects
- **100GB** bandwidth/month
- **Automatic deployments** on git push
- **HTTPS** included
- **Custom domains** supported

---

## 🔄 Continuous Deployment

Both platforms support automatic deployments:

- **Railway:** Auto-deploys on push to `main` branch
- **Vercel:** Auto-deploys on push to `main` branch

Just push to GitHub and both will redeploy automatically!

---

## 📚 Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

## 🎉 You're Done!

Your application should now be live:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.up.railway.app/graphql`

Happy deploying! 🚀

