# StackMoneyUp Development Server Starter
# This script sets required environment variables and starts the dev server

Write-Host "🚀 Starting StackMoneyUp Development Server..." -ForegroundColor Cyan
Write-Host ""

# Load environment variables from .env.local
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Only set non-NEXT_PUBLIC variables (NEXT_PUBLIC_ ones are loaded by Next.js automatically)
            if ($key -notlike "NEXT_PUBLIC_*" -and $key -notlike "#*") {
                Set-Item -Path "env:$key" -Value $value
                Write-Host "✅ Set $key" -ForegroundColor Green
            }
        }
    }
    Write-Host ""
}

Write-Host "🔥 Starting Next.js development server..." -ForegroundColor Yellow
Write-Host ""

npm run dev

