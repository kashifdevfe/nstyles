# Quick Start: Deploy to Railway

## 🚀 Fast Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub
- Authorize Railway to access your repositories

### 3. Deploy Backend

1. **New Project** → **Deploy from GitHub repo**
2. Select your repository
3. Railway will auto-detect `backend` folder
4. **Add PostgreSQL Database:**
   - Click **"New"** → **"Database"** → **"Add PostgreSQL"**
   - Railway auto-creates `DATABASE_URL`
5. **Add Environment Variables:**
   ```
   JWT_SECRET=<generate-random-string>
   FRONTEND_URL=<will-update-after-frontend-deploy>
   ```
6. **Generate Domain:**
   - Settings → Networking → Generate Domain
   - Copy the URL (e.g., `your-backend.up.railway.app`)

### 4. Deploy Frontend

1. In same project, click **"New"** → **"GitHub Repo"**
2. Select same repository
3. **Set Root Directory:**
   - Settings → Root Directory → `frontend`
4. **Add Environment Variable:**
   ```
   NEXT_PUBLIC_GRAPHQL_URL=https://your-backend.up.railway.app/graphql
   ```
   (Replace with your actual backend URL)
5. **Generate Domain:**
   - Settings → Networking → Generate Domain
   - Copy the URL (e.g., `your-frontend.up.railway.app`)

### 5. Update Backend CORS

1. Go to backend service
2. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-frontend.up.railway.app
   ```
3. Service will auto-redeploy

### 6. Verify Deployment

1. Check backend: `https://your-backend.up.railway.app/health`
2. Check frontend: `https://your-frontend.up.railway.app`
3. Test login with default credentials

## 🔑 Generate JWT Secret

Use this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📝 Default Login Credentials

**Admin:**
- Email: `admin@barber.com`
- Password: `admin123`

**Barber:**
- Email: `john@barber.com`
- Password: `barber123`

## ⚠️ Important Notes

1. **Database Migrations:** Run automatically on first deploy
2. **Environment Variables:** Must be set before first deploy
3. **CORS:** Backend needs frontend URL for CORS to work
4. **Free Tier:** $5 credit/month, services sleep after inactivity

## 🐛 Troubleshooting

**Backend won't start:**
- Check `DATABASE_URL` is set
- Verify migrations completed
- Check logs in Railway dashboard

**Frontend can't connect:**
- Verify `NEXT_PUBLIC_GRAPHQL_URL` is correct
- Check backend is running
- Verify CORS settings

**Database errors:**
- Check PostgreSQL service is running
- Verify `DATABASE_URL` format
- Check migration logs

## 📚 Full Documentation

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed instructions.

