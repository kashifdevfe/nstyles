# 📝 Neon Setup: Step-by-Step with Screenshots Guide

## 🎯 What You'll Get

- ✅ Free PostgreSQL database (3GB)
- ✅ Works perfectly with Prisma
- ✅ No credit card required
- ✅ Ready in 5 minutes

---

## Step 1: Go to Neon Website

1. Open your browser
2. Go to: **https://neon.tech**
3. You'll see the homepage

---

## Step 2: Sign Up

1. Click the **"Sign Up"** or **"Get Started"** button (top right)
2. Choose **"Continue with GitHub"** (easiest option)
3. Authorize Neon to access your GitHub account
4. You'll be redirected to Neon dashboard

---

## Step 3: Create Your First Project

1. In the Neon dashboard, click **"Create a project"** button
2. Fill in:
   - **Project name:** `barber-shop` (or any name you like)
   - **Region:** Choose the closest to you:
     - `US East (Ohio)` - if you're in US East
     - `US West (Oregon)` - if you're in US West
     - `EU (Frankfurt)` - if you're in Europe
     - `Asia Pacific (Singapore)` - if you're in Asia
   - **PostgreSQL version:** `15` or `16` (both work fine)
3. Click **"Create project"**

**Wait 10-20 seconds** for Neon to create your database.

---

## Step 4: Get Your Connection String

After the project is created:

1. You'll see a dashboard with your project
2. Look for a section that says **"Connection string"** or **"Connection Details"**
3. You'll see something like:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. **Click the copy button** (📋) to copy the connection string
5. **IMPORTANT:** The password is shown only once! Save it somewhere safe.

**If you missed the password:**
- Go to **Settings** → **Connection Details**
- You can reset the password there

---

## Step 5: Create Local `.env` File

1. Go to your project folder: `C:\Users\SYS\Desktop\Barber\backend`
2. Create a new file named `.env` (no extension, just `.env`)
3. Open it in a text editor
4. Paste this content:

```env
DATABASE_URL="paste-your-neon-connection-string-here"
JWT_SECRET="c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88"
FRONTEND_URL="http://localhost:3000"
PORT=4000
NODE_ENV="development"
```

5. Replace `paste-your-neon-connection-string-here` with the connection string you copied from Neon
6. Save the file

**Example of what it should look like:**
```env
DATABASE_URL="postgresql://myuser:mypass123@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88"
FRONTEND_URL="http://localhost:3000"
PORT=4000
NODE_ENV="development"
```

---

## Step 6: Install Dependencies (If Not Done)

Open terminal in `backend` folder and run:

```bash
npm install
```

This installs all required packages including Prisma.

---

## Step 7: Generate Prisma Client

In the `backend` folder, run:

```bash
npm run prisma:generate
```

Or:
```bash
npx prisma generate
```

This creates the Prisma Client that connects to your database.

**Expected output:**
```
✔ Generated Prisma Client
```

---

## Step 8: Run Database Migrations

This creates all your tables in Neon:

```bash
npx prisma migrate deploy
```

**Expected output:**
```
✔ Applied migration: 20251126150824_init
✔ Applied migration: 20251126151026_fix_service_unique
✔ Applied migration: 20251126152556_add_shop_model
```

Your tables are now created in Neon! 🎉

---

## Step 9: (Optional) Seed the Database

This adds initial data (admin user, barber user, services):

```bash
npm run prisma:seed
```

**Expected output:**
```
✔ Seeded database successfully
```

Now you have:
- Admin user: `admin@barber.com` / `admin123`
- Barber user: `john@barber.com` / `barber123`
- Some sample services

---

## Step 10: Test Your Connection

Start your backend server:

```bash
npm run dev
```

**Expected output:**
```
🚀 Server ready at http://localhost:4000/graphql
📊 Health check at http://localhost:4000/health
```

Open your browser and visit:
- **Health check:** http://localhost:4000/health
- **GraphQL Playground:** http://localhost:4000/graphql

If you see the health check response, **you're connected!** ✅

---

## Step 11: View Your Database in Neon

1. Go back to [Neon Dashboard](https://console.neon.tech)
2. Click on your project
3. Click the **"Tables"** tab
4. You should see all your tables:
   - `User`
   - `Shop`
   - `Service`
   - `Entry`
   - `EntryService`

5. Click on any table to see the data
6. Use the **SQL Editor** tab to run custom queries

---

## Step 12: Use Neon with Deployments

### For Railway:

1. Go to Railway → Your backend service
2. **Settings** → **Variables**
3. Add new variable:
   - **Key:** `DATABASE_URL`
   - **Value:** Your Neon connection string
4. Save (Railway will auto-redeploy)

### For Render:

1. Go to Render → Your backend service
2. **Environment** tab
3. Add:
   - **Key:** `DATABASE_URL`
   - **Value:** Your Neon connection string
4. Save and redeploy

### For Fly.io:

```bash
fly secrets set DATABASE_URL="your-neon-connection-string"
```

---

## ✅ Verification Checklist

- [ ] Neon account created
- [ ] Project created in Neon
- [ ] Connection string copied
- [ ] `.env` file created with `DATABASE_URL`
- [ ] Prisma Client generated (`prisma generate`)
- [ ] Migrations deployed (`prisma migrate deploy`)
- [ ] Database seeded (optional)
- [ ] Backend server running
- [ ] Health check works (`/health` endpoint)
- [ ] Can see tables in Neon dashboard

---

## 🐛 Common Issues & Solutions

### Issue 1: "Can't connect to database"

**Solution:**
- Check your connection string is correct
- Make sure you copied the entire string
- Verify `.env` file is in `backend/` folder
- Check internet connection

### Issue 2: "Migration failed"

**Solution:**
```bash
# Try again
npx prisma migrate deploy

# Or reset (WARNING: deletes all data)
npx prisma migrate reset
```

### Issue 3: "PrismaClient not found"

**Solution:**
```bash
npm run prisma:generate
```

### Issue 4: "SSL required"

**Solution:**
Make sure your connection string ends with `?sslmode=require`

---

## 🎉 You're Done!

Your Neon database is set up and ready to use!

**What's Next:**
1. ✅ Use this `DATABASE_URL` in your deployments (Railway, Render, etc.)
2. ✅ Your backend will automatically connect
3. ✅ All Prisma operations will work seamlessly

**Pro Tips:**
- Neon dashboard has a great SQL editor
- You can create database branches (like Git branches)
- Connection pooling is automatic
- Free tier is generous (3GB)

---

## 📚 Need More Help?

- **Neon Docs:** https://neon.tech/docs
- **Prisma + Neon:** https://neon.tech/docs/guides/prisma
- **Neon Dashboard:** https://console.neon.tech

---

**Happy coding! 🚀**

