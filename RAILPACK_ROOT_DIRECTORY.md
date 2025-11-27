# 🔧 Railpack Root Directory Fix

## ❌ The Error

```
Railpack could not determine how to build the app.
```

Railpack is analyzing the **root directory** instead of the `backend/` folder.

## ✅ The Fix

**Root Directory MUST be set to `backend` in Railway Settings!**

### Step-by-Step:

1. **Railway Dashboard** → Your Backend Service → **Settings**
2. **Source** section (or **General** section)
3. **Root Directory** field
4. Set to: `backend` (exactly this, lowercase, no slash)
5. **Save**
6. **Redeploy**

---

## 🎯 Why This Happens

Railpack analyzes the directory specified in **Root Directory**:
- **Without Root Directory:** Analyzes `/` (root) → Can't find Node.js project
- **With Root Directory = `backend`:** Analyzes `/backend/` → Finds `package.json` ✅

---

## ✅ After Setting Root Directory

Railpack will:
1. Analyze `backend/` folder
2. Find `backend/package.json`
3. Detect Node.js project
4. Build successfully

---

## 🔍 Verification

After setting Root Directory and redeploying:

**In Railway Logs:**
```
Using Railpack
Analyzing backend/ folder
Detected Node.js project
Installing dependencies...
npm install
Building...
Starting...
```

---

## 📝 Quick Checklist

- [ ] Root Directory = `backend` in Railway Settings
- [ ] Saved changes
- [ ] Redeployed
- [ ] Check logs - should detect Node.js

---

**Set Root Directory to `backend` in Railway Settings, then redeploy!** 🚀


