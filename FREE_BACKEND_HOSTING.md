# 🆓 Free Backend Hosting Options for Testing

Complete guide to free platforms for deploying your Node.js/GraphQL backend.

---

## 🏆 Top Free Backend Hosting Platforms

### 1. **Render** ⭐ (Recommended)

**Free Tier:**
- ✅ Free web services (sleeps after 15 min inactivity)
- ✅ Free PostgreSQL database (90 days, then $7/month)
- ✅ 750 hours/month
- ✅ Automatic SSL
- ✅ GitHub auto-deploy
- ✅ Custom domains

**Pros:**
- Very easy setup
- Great documentation
- Reliable service
- Good for testing

**Cons:**
- Services sleep after inactivity (first request wakes them)
- Database expires after 90 days on free tier

**Best For:** Testing, small projects, MVPs

**Setup:**
1. Sign up at [render.com](https://render.com) with GitHub
2. New → Web Service → Connect GitHub repo
3. Set Root Directory: `backend`
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Add PostgreSQL database (New → PostgreSQL)
7. Add environment variables

**Environment Variables:**
```env
DATABASE_URL=<from-render-postgres>
JWT_SECRET=<your-secret>
FRONTEND_URL=<your-frontend-url>
PORT=10000
```

---

### 2. **Fly.io** 🚀

**Free Tier:**
- ✅ 3 shared-cpu-1x VMs (256MB RAM each)
- ✅ 3GB persistent volume storage
- ✅ 160GB outbound data transfer
- ✅ No sleep mode!
- ✅ Global edge network

**Pros:**
- **Never sleeps** (always-on)
- Fast global deployment
- Great for production-like testing
- Docker-based

**Cons:**
- More complex setup
- Requires Dockerfile
- Limited resources

**Best For:** Production-like testing, always-on services

**Setup:**
1. Install Fly CLI: `npm i -g @fly/cli`
2. Sign up at [fly.io](https://fly.io)
3. Run: `fly launch` in `backend` folder
4. Follow prompts
5. Deploy: `fly deploy`

**Create `backend/Dockerfile`:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 4000
CMD ["npm", "start"]
```

---

### 3. **Cyclic.sh** 🔄

**Free Tier:**
- ✅ Unlimited apps
- ✅ Always-on (no sleep)
- ✅ Automatic deployments
- ✅ Free PostgreSQL (via Supabase/Neon)
- ✅ Custom domains

**Pros:**
- Truly always-on
- Very simple setup
- Great for Node.js
- No credit card required

**Cons:**
- Newer platform (less established)
- Limited documentation

**Best For:** Simple Node.js apps, always-on testing

**Setup:**
1. Sign up at [cyclic.sh](https://cyclic.sh) with GitHub
2. New App → Connect repo
3. Set Root: `backend`
4. Auto-detects Node.js
5. Add environment variables

---

### 4. **Koyeb** 🌐

**Free Tier:**
- ✅ 2 services
- ✅ 512MB RAM per service
- ✅ Sleeps after 28 days inactivity
- ✅ Global edge network
- ✅ Automatic SSL

**Pros:**
- Fast global CDN
- Easy GitHub integration
- Good free tier

**Cons:**
- Services sleep after long inactivity
- Limited to 2 services

**Best For:** Global testing, edge deployment

**Setup:**
1. Sign up at [koyeb.com](https://koyeb.com)
2. Create App → GitHub
3. Select repo and `backend` folder
4. Add environment variables
5. Deploy

---

### 5. **Supabase** 🔥 (Backend + Database)

**Free Tier:**
- ✅ PostgreSQL database (500MB)
- ✅ 50,000 monthly active users
- ✅ 2GB file storage
- ✅ Edge functions (serverless)
- ✅ Real-time subscriptions

**Pros:**
- Database + backend services
- Great for full-stack apps
- Real-time features
- Excellent free tier

**Cons:**
- Better for Supabase-specific features
- Might need to adapt your code

**Best For:** Full-stack apps, real-time features

**Setup:**
1. Sign up at [supabase.com](https://supabase.com)
2. New project
3. Get database URL
4. Can host backend via Edge Functions or separate service

---

### 6. **Vercel** (Serverless Functions)

**Free Tier:**
- ✅ Unlimited serverless functions
- ✅ 100GB-hours execution
- ✅ 1,000GB bandwidth
- ✅ Always-on edge network

**Pros:**
- Perfect for Next.js
- Serverless (scales automatically)
- Fast global CDN
- Great free tier

**Cons:**
- Need to adapt to serverless
- Cold starts possible
- Better for API routes than full Express apps

**Best For:** Next.js API routes, serverless APIs

**Note:** Your current Express server would need adaptation for Vercel serverless.

---

### 7. **Railway** (Already Covered)

**Free Tier:**
- ✅ $5 credit/month
- ✅ 500 hours usage
- ✅ PostgreSQL included
- ✅ Sleeps after inactivity

**Best For:** Full-stack apps, easy setup

---

## 📊 Comparison Table

| Platform | Always-On | Database | Setup | Best For |
|----------|-----------|----------|-------|----------|
| **Render** | ❌ (sleeps) | ✅ Free 90 days | ⭐⭐⭐⭐⭐ | Testing, MVPs |
| **Fly.io** | ✅ | ❌ (separate) | ⭐⭐⭐ | Production-like |
| **Cyclic** | ✅ | ✅ (via Neon) | ⭐⭐⭐⭐ | Always-on testing |
| **Koyeb** | ❌ (28d sleep) | ❌ | ⭐⭐⭐⭐ | Global edge |
| **Supabase** | ✅ | ✅ | ⭐⭐⭐⭐ | Full-stack |
| **Vercel** | ✅ | ❌ | ⭐⭐⭐ | Serverless |
| **Railway** | ❌ (sleeps) | ✅ | ⭐⭐⭐⭐⭐ | Easy setup |

---

## 🗄️ Free Database Options

### For PostgreSQL (Your Prisma Setup):

1. **Render PostgreSQL** - Free 90 days, then $7/month
2. **Supabase** - Free tier: 500MB, unlimited projects
3. **Neon** - Free tier: 3GB storage, serverless Postgres
4. **Railway PostgreSQL** - Included with Railway
5. **ElephantSQL** - Free tier: 20MB (very limited)
6. **Aiven** - Free tier: 1GB PostgreSQL

### Recommended: **Neon** or **Supabase**

**Neon:**
- ✅ Truly free (3GB)
- ✅ Serverless PostgreSQL
- ✅ Perfect for Prisma
- ✅ Sign up at [neon.tech](https://neon.tech)

**Supabase:**
- ✅ 500MB free
- ✅ Great dashboard
- ✅ Additional features (auth, storage)

---

## 🚀 Quick Setup Guides

### Render Setup (Easiest)

1. **Create Account:** [render.com](https://render.com)
2. **New Web Service:**
   - Connect GitHub: `kashifdevfe/nstyles`
   - Root Directory: `backend`
   - Build: `npm install && npm run build`
   - Start: `npm start`
3. **Add PostgreSQL:**
   - New → PostgreSQL
   - Copy `DATABASE_URL`
4. **Environment Variables:**
   ```
   DATABASE_URL=<from-postgres>
   JWT_SECRET=<your-secret>
   FRONTEND_URL=<your-frontend>
   PORT=10000
   ```
5. **Deploy!**

### Fly.io Setup (Always-On)

1. **Install CLI:**
   ```bash
   npm i -g @fly/cli
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Create Dockerfile** in `backend/`:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npx prisma generate
   EXPOSE 4000
   CMD ["npm", "start"]
   ```

4. **Launch:**
   ```bash
   cd backend
   fly launch
   ```

5. **Add Database:**
   - Use Neon or Supabase for free PostgreSQL
   - Add `DATABASE_URL` to Fly secrets:
     ```bash
     fly secrets set DATABASE_URL=<your-url>
     ```

6. **Deploy:**
   ```bash
   fly deploy
   ```

### Cyclic Setup (Simplest Always-On)

1. **Sign up:** [cyclic.sh](https://cyclic.sh)
2. **New App** → GitHub → Select repo
3. **Root Directory:** `backend`
4. **Environment Variables:**
   - Add all your vars
   - For database, use Neon or Supabase
5. **Deploy automatically!**

---

## 💡 Recommendations

### For Quick Testing:
**Render** - Easiest setup, good for testing

### For Always-On Testing:
**Fly.io** or **Cyclic** - Never sleeps, production-like

### For Full-Stack:
**Supabase** - Database + backend services

### For Best Free Tier:
**Neon** (database) + **Fly.io** (backend) - Both truly free

---

## 🔧 Environment Variables Template

Use these for any platform:

```env
# Database (from your chosen provider)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# JWT Secret (generate new one)
JWT_SECRET=<generate-with-node-crypto>

# Frontend URL
FRONTEND_URL=https://your-frontend.vercel.app

# Port (check platform requirements)
PORT=4000  # or 10000 for Render, or auto for Fly.io
```

---

## 📝 Platform-Specific Notes

### Render
- Port must be from `$PORT` environment variable
- Services sleep after 15 min (first request wakes)
- Database free for 90 days

### Fly.io
- Requires Dockerfile
- Port from `PORT` env or default 8080
- Never sleeps (always-on)

### Cyclic
- Auto-detects Node.js
- Always-on
- Simple setup

### Koyeb
- Sleeps after 28 days inactivity
- Global edge network
- Easy GitHub integration

---

## 🎯 My Recommendation for You

**Best Combo for Free Testing:**

1. **Backend:** **Render** (easiest) or **Fly.io** (always-on)
2. **Database:** **Neon** (3GB free, serverless)
3. **Frontend:** **Vercel** (already set up)

**Why:**
- Render: Super easy, good for testing
- Fly.io: Never sleeps, production-like
- Neon: Best free PostgreSQL tier
- All truly free for testing

---

## 🚨 Important Notes

1. **Sleep Mode:** Most free tiers sleep after inactivity
   - Render: 15 minutes
   - Railway: Varies
   - Fly.io/Cyclic: Never sleeps ✅

2. **Database Limits:**
   - Free databases often have size/time limits
   - Neon and Supabase have best free tiers

3. **Resource Limits:**
   - Check each platform's free tier limits
   - Monitor usage to avoid surprises

4. **Credit Cards:**
   - Some platforms require CC for "free" tier
   - Render, Fly.io, Cyclic don't require CC

---

## 📚 Resources

- [Render Docs](https://render.com/docs)
- [Fly.io Docs](https://fly.io/docs)
- [Cyclic Docs](https://docs.cyclic.sh)
- [Neon Docs](https://neon.tech/docs)
- [Supabase Docs](https://supabase.com/docs)

---

## ✅ Quick Start Checklist

Choose your platform and follow:

- [ ] Sign up with GitHub
- [ ] Connect repository
- [ ] Set root directory to `backend`
- [ ] Add environment variables
- [ ] Set up free PostgreSQL (Neon/Supabase)
- [ ] Deploy!
- [ ] Test your GraphQL endpoint
- [ ] Update frontend `NEXT_PUBLIC_GRAPHQL_URL`

---

**Happy Testing! 🚀**

