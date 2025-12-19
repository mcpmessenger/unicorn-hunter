# PowerShell script to link Vercel project
# This will create .vercel directory with project ID

Write-Host "Linking Vercel project..." -ForegroundColor Cyan
Write-Host ""

# Run vercel link (interactive)
npx vercel link

Write-Host ""
Write-Host "After linking, check .vercel/project.json for your project ID" -ForegroundColor Green

