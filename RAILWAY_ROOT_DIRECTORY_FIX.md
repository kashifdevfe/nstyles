# 🔧 Railway Root Directory Fix - Step by Step

## ❌ Current Error

Railway is building from **root directory** but your code is in `backend/` folder.

## ✅ Solution: Set Root Directory in Railway Dashboard

**You MUST do this in Railway's web interface - it cannot be set in config files!**

---

## 📋 Step-by-Step Instructions

### Step 1: Open Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Login to your account
3. Open your project (the one showing the error)

### Step 2: Find Your Service

You should see a service in your project. If you don't have one yet:
- Click **"New"** → **"GitHub Repo"**
- Select: `kashifdevfe/nstyles`
- This creates a service

### Step 3: Open Service Settings

1. Click on the **service** (the box showing the error)
2. Click the **"Settings"** tab (gear icon or "Settings" button)
3. Scroll down to find **"Root Directory"**

### Step 4: Set Root Directory

1. Find the **"Root Directory"** field
2. You'll see it's probably empty or set to `.` (root)
3. Click **"Edit"** or **"Change"** button next to it
4. **Type:** `backend` (exactly this, no slash, no quotes)
5. Click **"Save"** or **"Update"**

### Step 5: Redeploy

After saving:
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** button (or push a new commit)
3. Railway will now build from `backend/` folder ✅

---

## 🖼️ Visual Guide

**What you should see in Railway:**

```
Project: Your Project Name
└── Service: barber-backend (or similar)
    ├── Settings
    │   ├── Root Directory: backend  ← SET THIS!
    │   ├── Build Command: (auto)
    │   └── Start Command: (auto)
    ├── Variables
    │   ├── DATABASE_URL
    │   ├── JWT_SECRET
    │   └── ...
    └── Deployments
```

---

## ✅ After Setting Root Directory

Railway will:
1. ✅ Find `backend/package.json`
2. ✅ Run `npm install` in `backend/` folder
3. ✅ Run `npm run build` (Prisma generate)
4. ✅ Run migrations from `backend/railway.json`
5. ✅ Start server with `npm start`

---

## 🔍 Can't Find Root Directory Setting?

**Option 1: Check Service Settings**
- Make sure you're in the **service** settings, not project settings
- Look for "Root Directory" or "Source" section

**Option 2: Delete and Recreate Service**
1. Delete the current service
2. **New** → **GitHub Repo**
3. Select: `kashifdevfe/nstyles`
4. **Before deploying**, go to Settings → Set Root Directory to `backend`
5. Then add environment variables
6. Then deploy

**Option 3: Use Railway CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Set root directory (if CLI supports it)
# Note: This might not be available, dashboard is preferred
```

---

## 🚨 Important Notes

1. **Root Directory must be set BEFORE first deploy**
   - If you already deployed, set it and redeploy

2. **No trailing slash**
   - ✅ Correct: `backend`
   - ❌ Wrong: `backend/`

3. **Case sensitive**
   - Make sure it matches exactly: `backend` (lowercase)

4. **Cannot be set in config files**
   - Railway doesn't read root directory from `railway.json` or `railway.toml`
   - Must be set in dashboard

---

## 📝 Environment Variables Checklist

While you're in Settings, make sure these are set in **Variables** tab:

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

---

## 🧪 Test After Fix

1. **Check Deployments Tab**
   - Should show "Building..." then "Deploying..."
   - Should complete successfully

2. **Check Logs**
   - Should see: `npm install`
   - Should see: `prisma generate`
   - Should see: `prisma migrate deploy`
   - Should see: `Server ready at http://localhost:4000/graphql`

3. **Test Health Endpoint**
   - Get your Railway URL from Settings → Networking
   - Visit: `https://your-app.up.railway.app/health`
   - Should return: `{"status":"ok","message":"Barber Shop API is running"}`

---

## 🆘 Still Not Working?

### Error: "Cannot find package.json"
- ✅ Root Directory is set to `backend`?
- ✅ Check spelling: `backend` (not `Backend` or `backend/`)
- ✅ Redeploy after changing

### Error: "Build failed"
- Check logs for specific error
- Verify `DATABASE_URL` is set
- Check `backend/package.json` exists

### Error: "Nixpacks build failed"
- This means Root Directory is still not set correctly
- Double-check in Settings → Root Directory = `backend`
- Try deleting service and recreating with Root Directory set first

---

## 🎯 Quick Checklist

- [ ] Opened Railway dashboard
- [ ] Found service (or created new one)
- [ ] Went to Settings tab
- [ ] Set Root Directory to: `backend`
- [ ] Saved changes
- [ ] Added environment variables
- [ ] Redeployed
- [ ] Checked logs - build successful
- [ ] Tested health endpoint

---

**The key is: Root Directory = `backend` in Railway Settings!**

Once you set this, Railway will find your `backend/package.json` and build correctly. 🚀

