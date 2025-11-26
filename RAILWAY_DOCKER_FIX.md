# 🔧 Fix Railway Docker Build Error

## ❌ The Error

```
/bin/bash: line 1: npm: command not found
ERROR: failed to build: failed to solve: process "/bin/bash -ol pipefail -c npm install && npm run build" did not complete successfully
```

## 🔍 The Problem

Railway is trying to use **Docker** instead of **Nixpacks**. The Dockerfile might be incomplete or Railway is detecting it and trying to use it.

## ✅ Solution 1: Force Railway to Use Nixpacks (Recommended)

### Step 1: Check Railway Settings

1. Go to Railway dashboard
2. Click on your service
3. Go to **Settings** tab
4. Look for **"Builder"** or **"Build Method"**
5. Make sure it's set to **"Nixpacks"** (not Docker)

### Step 2: Remove or Rename Dockerfile (Temporary)

Railway might be auto-detecting the Dockerfile. Let's hide it:

**Option A: Rename it (so Railway doesn't detect it)**
```bash
# In backend folder
mv Dockerfile Dockerfile.flyio
```

**Option B: Add to .railwayignore**
Create `backend/.railwayignore`:
```
Dockerfile
```

### Step 3: Ensure nixpacks.toml is Correct

Your `backend/nixpacks.toml` should be:
```toml
[phases.setup]
nixPkgs = ["nodejs_18"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm run prisma:generate && npx prisma migrate deploy && npm start"
```

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click **"Redeploy"**
3. Railway should now use Nixpacks ✅

---

## ✅ Solution 2: Fix Dockerfile (If Railway Insists on Docker)

If Railway keeps using Docker, fix the Dockerfile:

### Updated Dockerfile

```dockerfile
# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install ALL dependencies (including devDependencies for Prisma)
RUN npm ci

# Copy application files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start command (runs migrations and starts server)
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
```

**Key changes:**
- ✅ Uses `node:18-alpine` (has npm)
- ✅ Uses `npm ci` (clean install)
- ✅ Installs all deps (needed for Prisma)
- ✅ Generates Prisma Client
- ✅ Runs migrations on start

---

## 🎯 Recommended: Use Nixpacks (Solution 1)

**Why Nixpacks?**
- ✅ Simpler configuration
- ✅ Better for Node.js apps
- ✅ Automatic detection
- ✅ Less configuration needed

**Steps:**
1. Set Builder to "Nixpacks" in Railway Settings
2. Rename `Dockerfile` to `Dockerfile.flyio` (so Railway doesn't detect it)
3. Ensure `nixpacks.toml` exists in `backend/` folder
4. Redeploy

---

## 🔍 How to Check What Railway is Using

1. Go to **Deployments** tab
2. Click on a deployment
3. Check the **Logs**
4. Look for:
   - `Using Nixpacks` → Good! ✅
   - `Using Dockerfile` → Need to fix ❌

---

## 📝 Quick Fix Checklist

- [ ] Root Directory set to `backend` in Railway Settings
- [ ] Builder set to "Nixpacks" in Railway Settings
- [ ] `backend/nixpacks.toml` exists and is correct
- [ ] `backend/railway.json` has `"builder": "NIXPACKS"`
- [ ] Renamed `Dockerfile` to `Dockerfile.flyio` (optional)
- [ ] Environment variables set (DATABASE_URL, JWT_SECRET, etc.)
- [ ] Redeployed

---

## 🐛 Still Getting Docker Error?

### Force Nixpacks in Railway Settings:

1. **Settings** → **Build & Deploy**
2. **Builder:** Select **"Nixpacks"** explicitly
3. **Build Command:** Leave empty (uses nixpacks.toml)
4. **Start Command:** Leave empty (uses railway.json)

### Or Delete Dockerfile:

```bash
cd backend
# Backup first
cp Dockerfile Dockerfile.backup
# Remove from Railway's view
echo "Dockerfile" >> .railwayignore
```

---

## ✅ Expected Success Logs

When using Nixpacks, you should see:

```
Using Nixpacks
Detected Node.js project
Installing dependencies...
npm install
Building...
npm run build
Generating Prisma Client...
Deploying...
Starting server...
```

---

## 🎯 Summary

**The Fix:**
1. Set Builder to "Nixpacks" in Railway Settings
2. Hide Dockerfile (rename or add to .railwayignore)
3. Ensure `nixpacks.toml` is correct
4. Redeploy

**Railway should now use Nixpacks and build successfully!** 🚀

