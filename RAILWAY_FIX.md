# 🔧 Fix Railway Build Error

## ❌ The Problem

Railway is trying to build from the **root directory**, but your backend code is in the `backend/` folder. Railway can't find `package.json` in the root.

## ✅ The Solution

You need to tell Railway to use the `backend` folder as the root directory.

---

## 🚀 Quick Fix (2 Steps)

### Step 1: Set Root Directory in Railway

1. Go to your Railway project dashboard
2. Click on your **backend service** (or create a new service)
3. Go to **Settings** tab
4. Scroll down to **"Root Directory"**
5. Click **"Edit"** or **"Change"**
6. Enter: `backend`
7. Click **"Save"**

### Step 2: Redeploy

1. Go to **Deployments** tab
2. Click **"Redeploy"** or push a new commit
3. Railway will now build from the `backend/` folder ✅

---

## 📋 Complete Railway Setup (If Starting Fresh)

### 1. Create Backend Service

1. Go to [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Select: `kashifdevfe/nstyles`
4. Railway will create a service

### 2. Configure Service

1. Click on the service
2. Go to **Settings** tab
3. **Root Directory:** Set to `backend`
4. **Build Command:** (auto-detected, or leave empty)
5. **Start Command:** (auto-detected from `backend/railway.json`)

### 3. Add Environment Variables

Go to **Variables** tab → Add:

```
DATABASE_URL=postgresql://neondb_owner:npg_7Y9ZwVorDBvz@ep-purple-forest-ahbp59eq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

```
JWT_SECRET=c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88
```

```
FRONTEND_URL=https://your-frontend.vercel.app
```

```
PORT=4000
```

### 4. Generate Domain

1. **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy the URL

### 5. Deploy

Railway will auto-deploy! Check the **Deployments** tab.

---

## ✅ Verify It's Working

After setting root directory to `backend`:

1. Check **Deployments** tab - should show successful build
2. Check **Logs** - should see:
   - `npm install` running
   - `prisma generate` running
   - `prisma migrate deploy` running
   - Server starting on port 4000

3. Visit: `https://your-app.up.railway.app/health`
   - Should return: `{"status":"ok","message":"Barber Shop API is running"}`

---

## 🐛 Still Having Issues?

### Issue: "Cannot find package.json"

**Solution:** Make sure Root Directory is set to `backend` (not `backend/` with trailing slash)

### Issue: "Build failed"

**Check:**
- Root Directory is `backend`
- Environment variables are set
- `DATABASE_URL` is correct
- Check logs for specific error

### Issue: "Prisma errors"

**Solution:** 
- Make sure `DATABASE_URL` is set
- Check Neon database is active
- Verify connection string is correct

---

## 📝 Railway Configuration Files

Your `backend/railway.json` is already configured correctly:

```json
{
  "deploy": {
    "startCommand": "npm run prisma:generate && npx prisma migrate deploy && npm start"
  }
}
```

This will:
1. Generate Prisma Client
2. Run migrations
3. Start the server

---

## 🎯 Summary

**The Fix:** Set Root Directory to `backend` in Railway Settings

**That's it!** Railway will now find your `package.json` and build correctly.

---

**Need help?** Check Railway logs for specific error messages.

