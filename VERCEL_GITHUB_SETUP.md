# Vercel + GitHub Auto-Deployment Setup

## Automatic Deployment

Vercel automatically deploys your application when you push to GitHub if your repository is connected. Here's how to ensure it's set up correctly:

## Setup Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will automatically detect Next.js settings
5. Click **"Deploy"**

### 2. Automatic Deployments

Once connected, Vercel will automatically:
- ✅ Deploy on every push to `main` or `master` branch
- ✅ Create preview deployments for pull requests
- ✅ Rebuild on every commit

### 3. GitHub Workflow

A GitHub Actions workflow has been created (`.github/workflows/vercel-deploy.yml`) that:
- Runs on every push to main/master
- Runs on pull requests
- Provides visibility into deployment triggers

## Manual Trigger (if needed)

If you need to manually trigger a deployment:

1. **Via Vercel Dashboard:**
   - Go to your project in Vercel
   - Click **"Redeploy"** button

2. **Via GitHub:**
   - Push any commit to trigger auto-deployment
   - Or create an empty commit: `git commit --allow-empty -m "Trigger Vercel build" && git push`

3. **Via Vercel CLI:**
   ```bash
   vercel --prod
   ```

## Verification

To verify deployments are working:

1. Make a small change (like updating a comment)
2. Commit and push to GitHub
3. Check Vercel dashboard - you should see a new deployment starting automatically
4. The deployment will appear in the Vercel dashboard within seconds

## Troubleshooting

### If deployments aren't triggering:

1. **Check Vercel Integration:**
   - Go to Vercel Dashboard → Settings → Git
   - Ensure your GitHub repository is connected

2. **Check Repository Permissions:**
   - Vercel needs access to your repository
   - Go to GitHub Settings → Applications → Authorized OAuth Apps
   - Ensure Vercel has the necessary permissions

3. **Check Branch Settings:**
   - In Vercel Dashboard → Settings → Git
   - Ensure "Production Branch" is set to `main` or `master`

4. **Manual Trigger:**
   - Push a commit to trigger deployment
   - Or use `git commit --allow-empty -m "Trigger build" && git push`

## Current Status

✅ GitHub workflow created (`.github/workflows/vercel-deploy.yml`)  
✅ Repository should be connected to Vercel  
✅ Auto-deployment enabled on push to main/master  

---

**Note:** The GitHub workflow is informational. Vercel's native integration handles the actual deployments automatically when connected.
