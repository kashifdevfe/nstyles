# 🚀 Deploy with Neon Database

Quick guide to deploy your backend with Neon database already set up.

## ✅ What You Have Ready

- ✅ Neon database connected
- ✅ Migrations applied
- ✅ Database seeded
- ✅ Connection string: `postgresql://neondb_owner:npg_7Y9ZwVorDBvz@ep-purple-forest-ahbp59eq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`

---

## 🎯 Choose Your Platform

### Option 1: **Render** (Easiest - 5 minutes) ⭐

### Option 2: **Railway** (Also Easy - 5 minutes)

### Option 3: **Fly.io** (Always-On - 10 minutes)

---

## 📋 Option 1: Deploy to Render

### Step 1: Sign Up
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `kashifdevfe/nstyles`
3. Click **"Connect"**

### Step 3: Configure Service
Fill in these settings:

- **Name:** `barber-backend` (or any name)
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### Step 4: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"** and add:

```
DATABASE_URL=postgresql://neondb_owner:npg_7Y9ZwVorDBvz@ep-purple-forest-ahbp59eq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

```
JWT_SECRET=c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88
```

```
FRONTEND_URL=https://your-frontend.vercel.app
```
*(Update this after you deploy frontend)*

```
PORT=10000
```

```
NODE_ENV=production
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Check logs for any errors

### Step 6: Get Your URL
1. Once deployed, go to **Settings**
2. Scroll to **"Custom Domain"**
3. Your service URL: `https://barber-backend.onrender.com` (or similar)
4. Copy this URL!

### Step 7: Test
Visit: `https://your-backend.onrender.com/health`

You should see: `{"status":"ok","message":"Barber Shop API is running"}`

---

## 📋 Option 2: Deploy to Railway

### Step 1: Sign Up
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway

### Step 2: Create Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: `kashifdevfe/nstyles`
4. Railway will auto-detect `backend` folder

### Step 3: Add Environment Variables
Go to your service → **Variables** tab → **"New Variable"**:

```
DATABASE_URL=postgresql://neondb_owner:npg_7Y9ZwVorDBvz@ep-purple-forest-ahbp59eq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

```
JWT_SECRET=c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88
```

```
FRONTEND_URL=https://your-frontend.vercel.app
```
*(Update after frontend deploy)*

```
PORT=4000
```

### Step 4: Generate Domain
1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `barber-backend.up.railway.app`)

### Step 5: Deploy
Railway auto-deploys! Check the **Deployments** tab.

### Step 6: Test
Visit: `https://your-backend.up.railway.app/health`

---

## 📋 Option 3: Deploy to Fly.io (Always-On)

### Step 1: Install Fly CLI
```bash
npm i -g @fly/cli
```

### Step 2: Sign Up & Login
1. Go to [fly.io](https://fly.io) and sign up
2. Login via CLI:
```bash
fly auth login
```

### Step 3: Launch App
```bash
cd backend
fly launch
```

Follow the prompts:
- **App name:** `barber-backend` (or choose your own)
- **Region:** Choose closest (e.g., `iad` for US East)
- **PostgreSQL:** Say **No** (we're using Neon)
- **Deploy now:** Say **No** (we'll add secrets first)

### Step 4: Add Secrets
```bash
fly secrets set DATABASE_URL="postgresql://neondb_owner:npg_7Y9ZwVorDBvz@ep-purple-forest-ahbp59eq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

```bash
fly secrets set JWT_SECRET="c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88"
```

```bash
fly secrets set FRONTEND_URL="https://your-frontend.vercel.app"
```
*(Update after frontend deploy)*

### Step 5: Deploy
```bash
fly deploy
```

### Step 6: Get Your URL
After deployment, you'll see:
```
App: barber-backend
URL: https://barber-backend.fly.dev
```

### Step 7: Test
Visit: `https://your-app.fly.dev/health`

---

## 🔄 After Backend Deployment

### 1. Update Frontend Environment Variable

When you deploy frontend (Vercel), add:

```
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend-url/graphql
```

Replace `your-backend-url` with:
- Render: `https://barber-backend.onrender.com`
- Railway: `https://barber-backend.up.railway.app`
- Fly.io: `https://barber-backend.fly.dev`

### 2. Update Backend CORS

Update `FRONTEND_URL` in your backend with your Vercel URL:
- Render: Go to Environment Variables → Update `FRONTEND_URL`
- Railway: Go to Variables → Update `FRONTEND_URL`
- Fly.io: `fly secrets set FRONTEND_URL="https://your-frontend.vercel.app"`

---

## ✅ Verification Checklist

- [ ] Backend deployed successfully
- [ ] Health check works: `/health` endpoint
- [ ] GraphQL endpoint accessible: `/graphql`
- [ ] Database connected (check logs for Prisma connection)
- [ ] Frontend deployed with `NEXT_PUBLIC_GRAPHQL_URL`
- [ ] Backend `FRONTEND_URL` updated
- [ ] Can login with: `admin@barber.com` / `admin123`

---

## 🐛 Troubleshooting

### Backend Won't Start
- Check logs in platform dashboard
- Verify `DATABASE_URL` is correct
- Check `JWT_SECRET` is set
- Verify `PORT` is correct (10000 for Render, 4000 for Railway/Fly.io)

### Database Connection Error
- Verify Neon connection string is correct
- Check Neon dashboard - is database active?
- Try connection string with `?sslmode=require`

### CORS Errors
- Update `FRONTEND_URL` in backend
- Check frontend URL matches exactly (no trailing slash)
- Verify frontend is deployed

### Migration Errors
- Migrations should run automatically on first deploy
- Check Railway/Render logs for migration output
- If needed, run manually: `npx prisma migrate deploy`

---

## 🎉 You're Deployed!

Your backend is now live with Neon database!

**Next Steps:**
1. Deploy frontend to Vercel
2. Update `NEXT_PUBLIC_GRAPHQL_URL` in Vercel
3. Update `FRONTEND_URL` in backend
4. Test the full application!

---

## 📝 Quick Reference

### Your Neon Connection String:
```
postgresql://neondb_owner:npg_7Y9ZwVorDBvz@ep-purple-forest-ahbp59eq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Your JWT Secret:
```
c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88
```

### Default Login:
- **Admin:** `admin@barber.com` / `admin123`
- **Barber:** `john@barber.com` / `barber123`

---

**Happy Deploying! 🚀**

