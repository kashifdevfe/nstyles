# ⚡ Quick Deploy with Neon (Copy & Paste)

## 🎯 Your Neon Connection String

```
postgresql://neondb_owner:npg_7Y9ZwVorDBvz@ep-purple-forest-ahbp59eq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

---

## 🚀 Render (Easiest - 5 min)

1. **Go to:** [render.com](https://render.com) → Sign up with GitHub
2. **New Web Service** → Connect `kashifdevfe/nstyles`
3. **Settings:**
   - Root Directory: `backend`
   - Build: `npm install && npm run build`
   - Start: `npm start`
4. **Environment Variables:**
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_7Y9ZwVorDBvz@ep-purple-forest-ahbp59eq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88
   FRONTEND_URL=https://your-frontend.vercel.app
   PORT=10000
   NODE_ENV=production
   ```
5. **Deploy!** → Get URL: `https://your-app.onrender.com`

---

## 🚂 Railway (Also Easy - 5 min)

1. **Go to:** [railway.app](https://railway.app) → Sign up with GitHub
2. **New Project** → Deploy from GitHub → `kashifdevfe/nstyles`
3. **Variables** → Add:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_7Y9ZwVorDBvz@ep-purple-forest-ahbp59eq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88
   FRONTEND_URL=https://your-frontend.vercel.app
   PORT=4000
   ```
4. **Settings** → **Networking** → Generate Domain
5. **Auto-deploys!** → Get URL: `https://your-app.up.railway.app`

---

## ✈️ Fly.io (Always-On - 10 min)

```bash
# 1. Install CLI
npm i -g @fly/cli

# 2. Login
fly auth login

# 3. Launch (in backend folder)
cd backend
fly launch

# 4. Add secrets
fly secrets set DATABASE_URL="postgresql://neondb_owner:npg_7Y9ZwVorDBvz@ep-purple-forest-ahbp59eq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
fly secrets set JWT_SECRET="c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88"
fly secrets set FRONTEND_URL="https://your-frontend.vercel.app"

# 5. Deploy
fly deploy
```

Get URL: `https://your-app.fly.dev`

---

## ✅ After Deployment

1. **Test Backend:** Visit `https://your-backend-url/health`
2. **Deploy Frontend to Vercel:**
   - Add: `NEXT_PUBLIC_GRAPHQL_URL=https://your-backend-url/graphql`
3. **Update Backend:**
   - Update `FRONTEND_URL` with your Vercel URL

---

## 🔑 Quick Reference

**Neon URL:** `postgresql://neondb_owner:npg_7Y9ZwVorDBvz@ep-purple-forest-ahbp59eq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`

**JWT Secret:** `c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88`

**Login:** `admin@barber.com` / `admin123`

---

**Ready? Pick Render (easiest) and go! 🚀**

