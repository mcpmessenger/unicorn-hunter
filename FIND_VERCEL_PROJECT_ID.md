# How to Find Your Vercel Project ID

## Method 1: From Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Login if needed

2. **Find Your Project:**
   - Look for project: **unicorn-hunter-main**
   - Click on it to open

3. **Get Project ID:**
   - Go to **Settings** → **General**
   - Scroll down to **Project ID**
   - Copy the ID (looks like: `prj_xxxxxxxxxxxxxxxxxxxxx`)

   OR

   - The Project ID is also in the URL when viewing the project:
   - `https://vercel.com/[team]/[project-name]/settings`
   - Or check the API endpoint in browser dev tools

## Method 2: Using Vercel CLI

If you have Vercel CLI installed:

```powershell
# Install Vercel CLI globally (if not installed)
npm install -g vercel

# Login to Vercel
npx vercel login

# Link your project (this will create .vercel directory with project ID)
npx vercel link

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your team/account)
# - Link to existing project? Yes
# - What's the name of your existing project? unicorn-hunter-main
```

After running `vercel link`, it will create a `.vercel` directory with:
- `.vercel/project.json` - Contains the project ID

## Method 3: From Vercel API

You can also get it via API (if you have a Vercel token):

```powershell
# Get your projects list
curl -H "Authorization: Bearer YOUR_VERCEL_TOKEN" https://api.vercel.com/v9/projects
```

## Method 4: Check Project Settings URL

When you're in the Vercel dashboard:
- URL format: `https://vercel.com/[team]/[project-name]/settings`
- The project ID might be visible in the page source or API calls

## What to Do With the Project ID

Once you have it, you can:

1. **Add to `.vercel/project.json`:**
   ```json
   {
     "projectId": "prj_xxxxxxxxxxxxxxxxxxxxx",
     "orgId": "team_xxxxxxxxxxxxxxxxxxxxx"
   }
   ```

2. **Or use it in `vercel.json`:**
   ```json
   {
     "projectId": "prj_xxxxxxxxxxxxxxxxxxxxx"
   }
   ```

3. **Or just use `vercel link`** - it will handle everything automatically

## Quick Link Command

The easiest way is to just run:
```powershell
npx vercel link
```

This will:
- Ask you to login (if not already)
- Show you your projects
- Let you select `unicorn-hunter-main`
- Create `.vercel` directory with all needed info

