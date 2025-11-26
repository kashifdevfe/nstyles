# ⚡ Quick Fix: Frontend API Calls

## 🎯 The Problem

Frontend at https://nstyle-test.vercel.app/ is calling `localhost:4000` instead of Railway backend.

## ✅ The Fix (2 Steps)

### Step 1: Add Environment Variable in Vercel

1. **Vercel Dashboard** → Your Project → **Settings**
2. **Environment Variables** → **Add New**
3. **Name:** `NEXT_PUBLIC_GRAPHQL_URL`
4. **Value:** `https://nstyles-production.up.railway.app/graphql`
5. **Save**
6. **Redeploy** (Deployments → Redeploy)

### Step 2: Update Backend CORS

1. **Railway** → Backend Service → **Settings** → **Variables**
2. Update `FRONTEND_URL` = `https://nstyle-test.vercel.app`
3. Railway auto-redeploys

---

## ✅ Done!

After redeploy, frontend will call Railway backend! 🚀

