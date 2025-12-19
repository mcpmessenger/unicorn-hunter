# Vercel Deployment Guide

## Latest Commit SHA

**Current HEAD:** `794ab35996dd1a1beed0dd5a1cab8f86d7509a0f`

**Latest Commit:** "Fix linter error in component scores logging"

## Recent Commits (All Pushed to GitHub)

1. `794ab35` - Fix linter error in component scores logging
2. `5cea6e3` - Add logging for component scores in direct API fallback path
3. `e8d506c` - Add fallback to direct API calls when agent_executor fails
4. `dad1293` - Update README with backend v1.3.1 note
5. `edf792c` - Update to backend v1.3.1 - mega-repo scoring fix

## Manual Deployment Options

### Option 1: Vercel Dashboard (Easiest)

1. Go to: https://vercel.com/dashboard
2. Select project: **unicorn-hunter-main**
3. Click **Deployments** tab
4. Click **Deploy** button (top right)
5. Select:
   - **Git Repository:** `mcpmessenger/unicorn-hunter`
   - **Branch:** `main`
   - **Commit:** `794ab35996dd1a1beed0dd5a1cab8f86d7509a0f` (or latest)
6. Click **Deploy**

### Option 2: Vercel CLI

```powershell
# Install Vercel CLI if needed
npm install -g vercel

# Deploy from current directory
npx vercel --prod

# Or deploy specific commit
npx vercel --prod --force
```

### Option 3: Trigger via Git (Force Push)

If auto-deploy isn't working, you can trigger it with a small change:

```powershell
# Make a small change to trigger deployment
echo "# Deployment trigger" >> .vercel-trigger
git add .vercel-trigger
git commit -m "Trigger Vercel deployment"
git push origin main
```

Then delete `.vercel-trigger` after deployment.

## Check Deployment Status

1. **Vercel Dashboard:** https://vercel.com/dashboard → `unicorn-hunter-main` → Deployments
2. **GitHub Integration:** Check if webhook is active at:
   - https://github.com/mcpmessenger/unicorn-hunter/settings/hooks

## Troubleshooting

### If Auto-Deploy Still Not Working

1. **Reconnect GitHub Integration:**
   - Vercel Dashboard → Settings → Git
   - Disconnect and reconnect the repository

2. **Check Webhook:**
   - GitHub → Settings → Webhooks
   - Verify Vercel webhook is active and recent deliveries succeeded

3. **Manual Deploy:**
   - Use Option 1 (Dashboard) or Option 2 (CLI) above

## Current Status

- ✅ All commits pushed to GitHub
- ✅ Code is ready for deployment
- ✅ Latest commit: `794ab35`
- ⚠️ Auto-deploy may need manual trigger

---

**Recommended:** Use Option 1 (Vercel Dashboard) for quickest deployment

