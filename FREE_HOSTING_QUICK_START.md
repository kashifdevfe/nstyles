# ⚡ Quick Start: Free Backend Hosting

## 🎯 Top 3 Recommendations (All Free!)

### 1. **Render** - Easiest Setup ⭐
**Best for:** Quick testing, easy deployment

**Steps:**
1. Go to [render.com](https://render.com) → Sign up with GitHub
2. **New Web Service** → Connect `kashifdevfe/nstyles`
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. **Add PostgreSQL:** New → PostgreSQL → Free tier
5. **Environment Variables:**
   ```
   DATABASE_URL=<from-postgres>
   JWT_SECRET=<your-secret>
   FRONTEND_URL=<your-frontend>
   PORT=10000
   ```
6. **Deploy!**

**Note:** Sleeps after 15 min inactivity (first request wakes it)

---

### 2. **Fly.io** - Always-On 🚀
**Best for:** Production-like testing, never sleeps

**Steps:**
1. Install CLI: `npm i -g @fly/cli`
2. Sign up: [fly.io](https://fly.io)
3. Login: `fly auth login`
4. In `backend` folder: `fly launch`
5. Follow prompts
6. Add secrets:
   ```bash
   fly secrets set DATABASE_URL=<your-neon-url>
   fly secrets set JWT_SECRET=<your-secret>
   fly secrets set FRONTEND_URL=<your-frontend>
   ```
7. Deploy: `fly deploy`

**Note:** Requires Dockerfile (already created for you!)

---

### 3. **Cyclic** - Simplest Always-On 🔄
**Best for:** Zero-config, always-on

**Steps:**
1. Go to [cyclic.sh](https://cyclic.sh) → Sign up with GitHub
2. **New App** → Connect `kashifdevfe/nstyles`
3. **Root Directory:** `backend`
4. **Environment Variables:** Add all your vars
5. **Deploy automatically!**

**Note:** Truly always-on, no sleep mode

---

## 🗄️ Free Database Options

### Option 1: **Neon** (Recommended)
- ✅ 3GB free forever
- ✅ Serverless PostgreSQL
- ✅ Perfect for Prisma
- Sign up: [neon.tech](https://neon.tech)

### Option 2: **Supabase**
- ✅ 500MB free
- ✅ Great dashboard
- Sign up: [supabase.com](https://supabase.com)

### Option 3: **Render PostgreSQL**
- ✅ Free 90 days
- ✅ Then $7/month
- Included with Render

---

## 🔑 Environment Variables (All Platforms)

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88
FRONTEND_URL=https://your-frontend.vercel.app
PORT=4000  # or 10000 for Render
```

---

## 📋 Quick Comparison

| Platform | Always-On | Setup Time | Best For |
|----------|-----------|------------|----------|
| **Render** | ❌ (sleeps) | 5 min | Quick testing |
| **Fly.io** | ✅ | 10 min | Production-like |
| **Cyclic** | ✅ | 3 min | Zero-config |

---

## 🚀 My Recommendation

**For Testing:** Use **Render** (easiest)
**For Always-On:** Use **Fly.io** or **Cyclic**

**Database:** Use **Neon** (best free tier)

---

## 📖 Full Guide

See [FREE_BACKEND_HOSTING.md](./FREE_BACKEND_HOSTING.md) for complete details on all platforms.

---

## ✅ Deployment Checklist

- [ ] Choose platform (Render/Fly.io/Cyclic)
- [ ] Sign up with GitHub
- [ ] Connect repository
- [ ] Set root directory: `backend`
- [ ] Set up free database (Neon/Supabase)
- [ ] Add environment variables
- [ ] Deploy!
- [ ] Test GraphQL endpoint
- [ ] Update frontend URL

---

**Ready to deploy? Pick one and go! 🚀**

