# ⚡ Quick Deploy Checklist

## 🎯 Your Generated JWT Secret
```
c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88
```
**Save this!** You'll need it for Railway backend.

---

## 📋 Deployment Checklist

### Railway (Backend) - 5 Steps

- [ ] 1. Sign up at [railway.app](https://railway.app) with GitHub
- [ ] 2. New Project → Deploy from GitHub → Select `kashifdevfe/nstyles`
- [ ] 3. Add PostgreSQL database (New → Database → PostgreSQL)
- [ ] 4. Add environment variables:
  ```
  JWT_SECRET=c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88
  FRONTEND_URL=<update-after-vercel>
  PORT=4000
  ```
- [ ] 5. Generate domain → Copy backend URL

**Backend URL:** `https://________________.up.railway.app`

---

### Vercel (Frontend) - 4 Steps

- [ ] 1. Sign up at [vercel.com](https://vercel.com) with GitHub
- [ ] 2. New Project → Import `kashifdevfe/nstyles`
- [ ] 3. Set Root Directory to: `frontend`
- [ ] 4. Add environment variable:
  ```
  NEXT_PUBLIC_GRAPHQL_URL=https://YOUR-BACKEND-URL.up.railway.app/graphql
  ```
- [ ] 5. Deploy → Copy frontend URL

**Frontend URL:** `https://________________.vercel.app`

---

### Final Step

- [ ] Update Railway `FRONTEND_URL` with your Vercel URL
- [ ] Both services will auto-redeploy
- [ ] Test login at your Vercel URL

---

## 🔑 Default Logins

**Admin:** `admin@barber.com` / `admin123`  
**Barber:** `john@barber.com` / `barber123`

---

## 📖 Full Guide

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

