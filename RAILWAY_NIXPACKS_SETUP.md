# ✅ Railway Nixpacks Setup (No Docker)

## 🎯 What We're Using

- ✅ **Nixpacks** (no Docker needed)
- ✅ **Prisma** for database
- ✅ **Neon PostgreSQL** (your existing database)

---

## ⚠️ IMPORTANT: Change Builder in Railway Dashboard

**You MUST change Builder from "Dockerfile" to "Nixpacks" in Railway Settings!**

### Steps:

1. **Railway Dashboard** → Your Service → **Settings**
2. **Build** section → **Builder**
3. Change from **"Dockerfile"** to **"Nixpacks"**
4. **Save**
5. **Redeploy**

---

## ✅ Configuration

### Root Directory
- Set to: `backend` ✅

### Builder
- Set to: **"Nixpacks"** (NOT Dockerfile!)

### Environment Variables
Make sure these are set:

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

## 🚀 Build Process (Nixpacks)

1. **Setup:** Installs Node.js 18
2. **Install:** Runs `npm install`
3. **Build:** Runs `npx prisma generate` (generates Prisma Client)
4. **Start:** Runs `npx prisma migrate deploy && npm start`

---

## ✅ Expected Logs

After switching to Nixpacks:

```
Using Nixpacks
Detected Node.js project
Installing dependencies...
npm install
Building...
npx prisma generate
  → Generating Prisma Client...
Starting...
npx prisma migrate deploy
  → Running migrations...
npm start
  → Server ready at http://localhost:4000/graphql
```

---

## 🐛 If Still Using Docker

**The error shows Dockerfile is still being used!**

**Fix:**
1. Go to Railway Settings → Build
2. Change Builder to **"Nixpacks"**
3. Save
4. Redeploy

**Do NOT use Dockerfile builder!**

---

## 📝 What I Fixed

1. ✅ Removed `postinstall` script (was running before files copied)
2. ✅ Moved Prisma generate to build phase in `nixpacks.toml`
3. ✅ Updated start command to run migrations first

---

## 🎯 Summary

**Change Builder to "Nixpacks" in Railway Settings, then redeploy!**

No Docker needed - just Nixpacks + Prisma + Neon PostgreSQL! 🚀

