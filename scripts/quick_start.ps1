# Quick Start Script for PowerShell - Connect Agents to Website
# Run this script to set everything up quickly

Write-Host "🚀 Quick Start: Connecting Agents to Website" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Python
Write-Host "📋 Step 1: Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Install dependencies
Write-Host "📋 Step 2: Installing Python dependencies..." -ForegroundColor Yellow
pip install -q fastapi uvicorn requests crewai crewai-tools
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 3: Get token
Write-Host "📋 Step 3: Getting API token..." -ForegroundColor Yellow
if (-not $env:STACKMONEYUP_PASSWORD) {
    Write-Host "⚠️  STACKMONEYUP_PASSWORD not set" -ForegroundColor Yellow
    $password = Read-Host "Enter your password" -AsSecureString
    $env:STACKMONEYUP_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
    )
}

$tokenOutput = python scripts/get_token.py 2>&1
$token = ($tokenOutput | Select-String -Pattern "STACKMONEYUP_API_TOKEN='([^']+)'" | ForEach-Object { $_.Matches.Groups[1].Value })

if (-not $token) {
    # Try alternative pattern
    $token = ($tokenOutput | Select-String -Pattern "eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+" | ForEach-Object { $_.Matches.Value } | Select-Object -First 1)
}

if (-not $token) {
    Write-Host "❌ Failed to get token" -ForegroundColor Red
    Write-Host "Token output: $tokenOutput" -ForegroundColor Yellow
    exit 1
}

$env:STACKMONEYUP_API_TOKEN = $token
Write-Host "✅ Token obtained" -ForegroundColor Green
Write-Host ""

# Step 4: Test connection
Write-Host "📋 Step 4: Testing connection..." -ForegroundColor Yellow
if (python scripts/test_connection.py) {
    Write-Host "✅ Connection test passed" -ForegroundColor Green
} else {
    Write-Host "❌ Connection test failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 5: Set environment variables
Write-Host "📋 Step 5: Setting up environment..." -ForegroundColor Yellow
if (-not $env:STACKMONEYUP_URL) {
    $env:STACKMONEYUP_URL = "https://stackmoneyup.com"
}

Write-Host "✅ Environment configured" -ForegroundColor Green
Write-Host ""
Write-Host "Environment variables set:"
Write-Host "  STACKMONEYUP_API_TOKEN=$($token.Substring(0, [Math]::Min(20, $token.Length)))..."
Write-Host "  STACKMONEYUP_URL=$env:STACKMONEYUP_URL"
Write-Host ""

# Step 6: Start agent service
Write-Host "📋 Step 6: Starting agent service..." -ForegroundColor Yellow
Write-Host "Starting on http://localhost:8000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop"
Write-Host ""

python scripts/agent_service.py


