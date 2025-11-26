# 🔧 Fix: Frontend Using Localhost Instead of Railway Backend

## ❌ The Problem

Your frontend at https://nstyle-test.vercel.app/ is calling `http://localhost:4000/graphql` instead of your Railway backend.

## ✅ The Fix

You need to set the `NEXT_PUBLIC_GRAPHQL_URL` environment variable in Vercel.

---

## 📋 Step-by-Step Fix

### Step 1: Add Environment Variable in Vercel

1. Go to [vercel.com](https://vercel.com)
2. Login to your account
3. Click on your project: `nstyles` (or the project name)
4. Go to **Settings** tab
5. Click **Environment Variables** in the left sidebar
6. Click **"Add New"** or **"Add"** button

### Step 2: Add the Variable

**Name:**
```
NEXT_PUBLIC_GRAPHQL_URL
```

**Value:**
```
https://nstyles-production.up.railway.app/graphql
```

**Environment:**
- ✅ Check **Production**
- ✅ Check **Preview** (optional, for preview deployments)
- ✅ Check **Development** (optional, for local dev)

7. Click **"Save"**

### Step 3: Redeploy Frontend

After adding the environment variable:

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Click **"Redeploy"**
4. OR push a new commit to trigger auto-deploy

**Important:** Environment variables require a redeploy to take effect!

---

## 🔄 Step 4: Update Backend CORS

After redeploying frontend, update backend to allow your Vercel URL:

1. Go to Railway → Your Backend Service
2. **Settings** → **Variables**
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://nstyle-test.vercel.app
   ```
4. Railway will auto-redeploy

---

## ✅ Verification

### Test Frontend:

1. Visit: https://nstyle-test.vercel.app/
2. Open browser **Developer Tools** (F12)
3. Go to **Network** tab
4. Try to login
5. Check the network requests - should see:
   - ✅ `https://nstyles-production.up.railway.app/graphql`
   - ❌ NOT `http://localhost:4000/graphql`

### Test Backend:

1. Visit: https://nstyles-production.up.railway.app/health
2. Should return: `{"status":"ok","message":"Barber Shop API is running"}`

---

## 🎯 Quick Checklist

- [ ] Added `NEXT_PUBLIC_GRAPHQL_URL` in Vercel
- [ ] Value = `https://nstyles-production.up.railway.app/graphql`
- [ ] Redeployed frontend in Vercel
- [ ] Updated `FRONTEND_URL` in Railway
- [ ] Tested login - should work now!

---

## 🐛 Still Not Working?

### Check 1: Environment Variable Name
- Must be exactly: `NEXT_PUBLIC_GRAPHQL_URL`
- Case sensitive!
- Must start with `NEXT_PUBLIC_` for Next.js

### Check 2: Redeploy Required
- Environment variables only work after redeploy
- Make sure you redeployed after adding the variable

### Check 3: Check Browser Console
- Open Developer Tools (F12)
- Check Console for errors
- Check Network tab for API calls

### Check 4: Backend CORS
- Make sure `FRONTEND_URL` in Railway = `https://nstyle-test.vercel.app`
- No trailing slash!

---

## 📝 Your URLs

**Frontend:** https://nstyle-test.vercel.app/  
**Backend:** https://nstyles-production.up.railway.app  
**GraphQL:** https://nstyles-production.up.railway.app/graphql

---

## 🚀 After Fixing

Your app should now:
- ✅ Frontend calls Railway backend (not localhost)
- ✅ Login works
- ✅ All API calls go to production backend
- ✅ CORS allows your Vercel domain

---

**Add the environment variable in Vercel and redeploy!** 🚀

