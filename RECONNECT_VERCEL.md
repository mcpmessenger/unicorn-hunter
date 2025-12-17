# Reconnect Vercel to GitHub

## Steps to Fix GitHub Integration

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select project: **unicorn-hunter-main**

2. **Check Git Settings:**
   - Click **Settings** → **Git**
   - Check if GitHub is connected
   - Note the repository shown

3. **Reconnect if needed:**
   - If disconnected or wrong repo: Click **Disconnect**
   - Click **Connect Git Repository**
   - Select **GitHub**
   - Choose: `mcpmessenger/unicorn-hunter`
   - Ensure **Production Branch** = `main`
   - Click **Save**

4. **Verify Webhook:**
   - After connecting, go to: https://github.com/mcpmessenger/unicorn-hunter/settings/hooks
   - You should see a Vercel webhook
   - Check recent deliveries for any errors

### Option 2: Check Which Project is Active

You have TWO Vercel projects:
- `unicorn-hunter-main` (updated 8m ago) ← **This one is active**
- `unicorn-hunter` (updated 1h ago)

Make sure you're working with **unicorn-hunter-main** which matches your local `.vercel` config.

### Option 3: Verify Current Deployment

The latest deployment just completed successfully. Check:
- URL: https://unicorn-hunter-main.vercel.app
- This should have the latest code with component scores fix

### Test After Reconnecting

1. Make a small test change
2. Commit and push to GitHub
3. Check Vercel dashboard - should auto-deploy within 1-2 minutes

## Current Status

- ✅ Latest code is on GitHub
- ✅ Deployment just completed (build successful)
- ❓ GitHub webhook may need reconnection for auto-deploy

