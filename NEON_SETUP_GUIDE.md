# 🗄️ Neon Database Setup Guide

Complete guide to set up a free PostgreSQL database on Neon for your Barber Shop app.

---

## 🎯 What is Neon?

- ✅ **3GB free** PostgreSQL database (forever free tier)
- ✅ **Serverless** - scales automatically
- ✅ **Perfect for Prisma** - works seamlessly
- ✅ **No credit card** required
- ✅ **Fast** - global edge network

---

## 📋 Step 1: Create Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with **GitHub** (easiest)
4. Authorize Neon to access your GitHub

---

## 🚀 Step 2: Create a New Project

1. After signing in, click **"Create a project"**
2. Fill in the details:
   - **Project Name:** `barber-shop` (or any name)
   - **Region:** Choose closest to you (e.g., `US East`, `EU West`)
   - **PostgreSQL Version:** `15` or `16` (both work)
3. Click **"Create project"**

---

## 🔑 Step 3: Get Your Database URL

After creating the project:

1. You'll see a **Connection String** on the dashboard
2. It looks like:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. **Copy this URL** - this is your `DATABASE_URL`

**Important:** 
- Click **"Show password"** if needed
- The password is shown only once - save it!
- You can reset it later in settings

---

## 🔧 Step 4: Update Your Local Environment

1. Create/update `.env` file in `backend/` folder:
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
   JWT_SECRET="c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88"
   FRONTEND_URL="http://localhost:3000"
   PORT=4000
   ```

2. **Test the connection:**
   ```bash
   cd backend
   npm run prisma:generate
   npx prisma migrate deploy
   ```

---

## 🚀 Step 5: Run Migrations

1. **Generate Prisma Client:**
   ```bash
   cd backend
   npm run prisma:generate
   ```

2. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

   This will create all your tables in Neon!

3. **(Optional) Seed the database:**
   ```bash
   npm run prisma:seed
   ```

---

## 🌐 Step 6: Use Neon with Your Deployments

### For Railway:

1. Go to Railway → Backend service → **Settings** → **Variables**
2. Add/Update:
   ```
   DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. Railway will automatically redeploy

### For Render:

1. Go to Render → Backend service → **Environment**
2. Add/Update:
   ```
   DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. Save and redeploy

### For Fly.io:

1. Set as secret:
   ```bash
   fly secrets set DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

2. Or add in `fly.toml`:
   ```toml
   [env]
     DATABASE_URL = "postgresql://..."
   ```

### For Cyclic/Koyeb:

1. Add in environment variables section:
   ```
   DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

---

## 🔐 Step 7: Get Connection String from Dashboard

If you need to find your connection string later:

1. Go to [Neon Dashboard](https://console.neon.tech)
2. Select your project
3. Click **"Connection Details"** or **"Connection String"**
4. Copy the connection string

**Or get it from Settings:**
1. Go to **Settings** → **Connection Details**
2. Copy the connection string
3. You can also reset password here if needed

---

## 🧪 Step 8: Test Your Connection

### Option 1: Using Prisma Studio

```bash
cd backend
npx prisma studio
```

This opens a browser at `http://localhost:5555` where you can view/edit your database.

### Option 2: Using Neon SQL Editor

1. Go to Neon Dashboard
2. Click **"SQL Editor"** tab
3. Run a test query:
   ```sql
   SELECT version();
   ```

### Option 3: Test from Your App

```bash
cd backend
npm run dev
```

Visit `http://localhost:4000/health` to verify server is running.

---

## 📊 Step 9: View Your Data in Neon

1. Go to Neon Dashboard
2. Click **"Tables"** tab
3. You'll see all your Prisma tables:
   - `User`
   - `Barber`
   - `Service`
   - `Shop`
   - etc.

4. Click on any table to view data
5. Use **SQL Editor** to run queries

---

## 🔄 Step 10: Update Prisma Schema (If Needed)

If you make changes to `backend/prisma/schema.prisma`:

1. **Create a new migration:**
   ```bash
   cd backend
   npx prisma migrate dev --name your_migration_name
   ```

2. **For production (Neon):**
   ```bash
   npx prisma migrate deploy
   ```

3. **Regenerate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

---

## 🛡️ Step 11: Security Best Practices

### 1. Use Connection Pooling (Recommended)

Neon supports connection pooling. Update your connection string:

**Original:**
```
postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb
```

**With Pooling:**
```
postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
```

Note the `-pooler` in the hostname. This helps with serverless functions.

### 2. Environment Variables

- ✅ Never commit `.env` files
- ✅ Use environment variables in deployments
- ✅ Rotate passwords regularly

### 3. Branching (Advanced)

Neon supports database branching (like Git branches):
- Create branches for testing
- Merge branches when ready
- Great for development workflows

---

## 🐛 Troubleshooting

### Connection Timeout

**Problem:** Can't connect to Neon

**Solutions:**
- Check your internet connection
- Verify connection string is correct
- Check if IP is whitelisted (Neon allows all by default)
- Try connection pooling URL

### Migration Errors

**Problem:** Migrations fail

**Solutions:**
```bash
# Reset migrations (careful - deletes data!)
npx prisma migrate reset

# Or deploy fresh
npx prisma migrate deploy
```

### SSL Required

**Problem:** SSL connection error

**Solution:** Add `?sslmode=require` to connection string:
```
postgresql://...?sslmode=require
```

### Prisma Client Not Generated

**Problem:** `PrismaClient` not found

**Solution:**
```bash
cd backend
npm run prisma:generate
```

---

## 📈 Neon Free Tier Limits

- ✅ **3GB storage** - plenty for testing
- ✅ **Unlimited projects** - create as many as you need
- ✅ **Automatic backups** - included
- ✅ **Branching** - create database branches
- ✅ **No time limits** - free forever

**Upgrade when needed:**
- More storage
- Better performance
- More compute

---

## 🔗 Quick Links

- **Neon Dashboard:** [console.neon.tech](https://console.neon.tech)
- **Neon Docs:** [neon.tech/docs](https://neon.tech/docs)
- **Prisma + Neon Guide:** [neon.tech/docs/guides/prisma](https://neon.tech/docs/guides/prisma)

---

## ✅ Checklist

- [ ] Sign up at [neon.tech](https://neon.tech)
- [ ] Create new project
- [ ] Copy connection string
- [ ] Update local `.env` file
- [ ] Run `prisma generate`
- [ ] Run `prisma migrate deploy`
- [ ] (Optional) Run `prisma seed`
- [ ] Test connection with Prisma Studio
- [ ] Add `DATABASE_URL` to deployment platform
- [ ] Verify data in Neon dashboard

---

## 🎉 You're Done!

Your Neon database is ready! 

**Next Steps:**
1. Use this `DATABASE_URL` in your Railway/Render/Fly.io deployment
2. Your backend will automatically connect
3. All your Prisma migrations will work seamlessly

**Pro Tip:** Neon works great with serverless functions because of connection pooling. Perfect for Vercel serverless functions if you ever need them!

---

## 💡 Example Connection String Format

```
postgresql://[user]:[password]@[host]/[dbname]?sslmode=require
```

Your Neon connection string will look like:
```
postgresql://myuser:mypassword@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Keep this secure!** Never commit it to Git.

---

**Happy coding! 🚀**

