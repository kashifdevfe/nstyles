# Neon Database Connection Troubleshooting

## Common Issues

### 1. Database is Paused (Most Common)
Neon free tier databases automatically pause after inactivity. You need to resume it:

1. Go to https://console.neon.tech
2. Log in to your account
3. Find your project "neondb"
4. If you see "Resume" or "Paused" status, click it to wake up the database
5. Wait 10-30 seconds for it to fully resume

### 2. Connection String Format

Your connection string should look like this:

**Pooler (recommended for serverless):**
```
postgresql://neondb_owner:npg_7Y9ZwVorDBvz@ep-purple-forest-ahbp59eq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Direct (alternative if pooler doesn't work):**
```
postgresql://neondb_owner:npg_7Y9ZwVorDBvz@ep-purple-forest-ahbp59eq.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

Note: Remove `-pooler` from the hostname for direct connection.

### 3. Check Your .env File

Make sure `backend/.env` exists and contains:
```env
DATABASE_URL="postgresql://neondb_owner:npg_7Y9ZwVorDBvz@ep-purple-forest-ahbp59eq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="c52a9c29745519ea83a5cf894f7574f31d868d69c09c1293866c76751907ae88"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

### 4. Test Connection

Run the test script:
```bash
cd backend
node utils/db-test.js
```

This will tell you exactly what's wrong.

## Quick Fix Steps

1. **Resume your Neon database** (most likely the issue)
2. **Verify .env file** has correct DATABASE_URL
3. **Test connection** with `node utils/db-test.js`
4. **Restart your server**

