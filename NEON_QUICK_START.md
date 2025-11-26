# ⚡ Neon Quick Start (5 Minutes)

## 🚀 Fast Setup Steps

### 1. Sign Up
- Go to [neon.tech](https://neon.tech)
- Click **"Sign Up"** → Use GitHub
- Authorize Neon

### 2. Create Project
- Click **"Create a project"**
- Name: `barber-shop`
- Region: Choose closest (e.g., `US East`)
- Click **"Create project"**

### 3. Get Connection String
- Copy the **Connection String** shown on dashboard
- Looks like: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
- **Save this!** (Password shown only once)

### 4. Update Local `.env`
Create/update `backend/.env`:
```env
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88"
FRONTEND_URL="http://localhost:3000"
PORT=4000
```

### 5. Run Migrations
```bash
cd backend
npm run prisma:generate
npx prisma migrate deploy
```

### 6. (Optional) Seed Database
```bash
npm run prisma:seed
```

### 7. Test It!
```bash
npm run dev
```
Visit: `http://localhost:4000/health`

---

## 🌐 Use with Deployments

### Railway/Render/Fly.io:
Add this environment variable:
```
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

---

## ✅ Done!

Your Neon database is ready! 🎉

**Full Guide:** See [NEON_SETUP_GUIDE.md](./NEON_SETUP_GUIDE.md)

