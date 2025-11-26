# 🔧 Railway Docker Build Troubleshooting

## Common Issues & Solutions

### Issue 1: "Cannot find package.json"

**Problem:** Railway is building from wrong directory.

**Solution:**
1. Go to Railway dashboard
2. Service → Settings → Root Directory
3. Set to: `backend`
4. Save and redeploy

---

### Issue 2: "npm: command not found"

**Problem:** Dockerfile not being used or Node.js not installed.

**Solution:**
1. Check Railway Settings → Build → Builder = "Dockerfile"
2. Verify `backend/Dockerfile` exists
3. Check Root Directory = `backend`

---

### Issue 3: "Prisma errors"

**Problem:** Prisma Client not generated or DATABASE_URL missing.

**Solution:**
1. Verify `DATABASE_URL` environment variable is set in Railway
2. Check Neon database is active
3. Dockerfile should run `npx prisma generate` (already included)

---

### Issue 4: "Port already in use"

**Problem:** PORT environment variable conflict.

**Solution:**
- Railway sets PORT automatically
- Server.js already uses `process.env.PORT || 4000` ✅
- No action needed

---

### Issue 5: "Build context error"

**Problem:** Dockerfile can't find files.

**Solution:**
1. Ensure Root Directory = `backend` in Railway Settings
2. Dockerfile should be in `backend/` folder ✅
3. All files should be relative to `backend/`

---

## ✅ Verification Checklist

- [ ] Root Directory = `backend` in Railway Settings
- [ ] Builder = "Dockerfile" in Railway Settings
- [ ] `backend/Dockerfile` exists
- [ ] Environment variables set:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `FRONTEND_URL`
  - [ ] `PORT` (optional, Railway sets automatically)
- [ ] Committed and pushed to GitHub
- [ ] Railway auto-redeployed

---

## 🔍 Check Railway Logs

1. Go to Railway dashboard
2. Click on your service
3. Go to **Deployments** tab
4. Click on the latest deployment
5. Check **Logs** for specific errors

**Look for:**
- ✅ `Successfully built` → Good!
- ✅ `npm install` running → Good!
- ✅ `prisma generate` running → Good!
- ❌ Any error messages → Check specific error

---

## 🚀 Expected Build Process

When Dockerfile works correctly, you should see:

```
Step 1/8 : FROM node:18-alpine
Step 2/8 : WORKDIR /app
Step 3/8 : COPY package*.json ./
Step 4/8 : RUN npm ci
  ... installing dependencies ...
Step 5/8 : COPY . .
Step 6/8 : RUN npx prisma generate
  ... generating Prisma Client ...
Step 7/8 : EXPOSE 4000
Step 8/8 : CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
Successfully built
Starting container...
Running migrations...
Server ready at http://localhost:4000/graphql
```

---

## 🐛 Still Not Working?

### Check These:

1. **Railway Dashboard:**
   - Settings → Root Directory = `backend`?
   - Settings → Build → Builder = "Dockerfile"?
   - Variables → All env vars set?

2. **GitHub:**
   - Is `backend/Dockerfile` in the repo?
   - Is `backend/railway.json` correct?

3. **Dockerfile Location:**
   - Should be: `backend/Dockerfile`
   - Not: `Dockerfile` (root)

4. **Test Locally (Optional):**
   ```bash
   cd backend
   docker build -t barber-backend .
   docker run -p 4000:4000 -e DATABASE_URL="your-url" barber-backend
   ```

---

## 📝 Quick Fix Steps

1. **Verify Root Directory:**
   - Railway → Service → Settings → Root Directory = `backend`

2. **Verify Builder:**
   - Railway → Service → Settings → Build → Builder = "Dockerfile"

3. **Check Environment Variables:**
   - Railway → Service → Variables
   - Ensure all are set

4. **Redeploy:**
   - Railway → Deployments → Redeploy

---

**If you see a specific error in Railway logs, share it and I can help fix it!**

