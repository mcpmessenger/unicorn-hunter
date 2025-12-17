# Fixing Vercel Auto-Deployment

## Current Status
- ✅ Code is pushed to GitHub: `mcpmessenger/unicorn-hunter`
- ✅ Vercel project is linked: `unicorn-hunter-main`
- ❌ Auto-deployment is not working

## Steps to Fix

### Option 1: Reconnect GitHub Integration (Recommended)

1. Go to: https://vercel.com/dashboard
2. Select your project: `unicorn-hunter-main`
3. Go to **Settings** → **Git**
4. Click **Disconnect** (if connected) or check connection status
5. Click **Connect Git Repository**
6. Select **GitHub** → Choose `mcpmessenger/unicorn-hunter`
7. Ensure **Production Branch** is set to `main`
8. Click **Save**

This will:
- Recreate the webhook
- Trigger an immediate deployment
- Enable auto-deployments for future pushes

### Option 2: Check Webhook Status

1. Go to: https://github.com/mcpmessenger/unicorn-hunter/settings/hooks
2. Look for a Vercel webhook
3. If missing or failed, reconnect via Vercel dashboard (Option 1)
4. If present, check recent deliveries for errors

### Option 3: Manual Deployment via Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select `unicorn-hunter-main`
3. Click **Deployments** tab
4. Click **Deploy** button (top right)
5. Select **GitHub** as source
6. Choose branch: `main`
7. Select commit: `be32d1e` (latest)
8. Click **Deploy**

### Option 4: Fix Vercel CLI Permissions

If you want to use CLI:

1. Go to: https://vercel.com/account/tokens
2. Create a new token
3. Run: `npx vercel login` (use token)
4. Then: `npx vercel --prod --yes`

## Verify Fix

After fixing:
1. Make a small test commit
2. Push to GitHub
3. Check Vercel dashboard - should see new deployment within 1-2 minutes
4. Verify deployment completes successfully

## Current Commits Waiting for Deployment

- `be32d1e` - Add debug logging for component scores parsing
- `af3950f` - Fix component scores parsing from agent_executor response structure
- `adc7d44` - Make deep analysis (codebase analysis) the default
- `0e1d170` - Add Deep Analysis checkbox to enable codebase analysis feature
- `2bd053d` - Add codebase analysis UI support

