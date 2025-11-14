#!/bin/bash
# Quick Start Script - Connect Agents to Website
# Run this script to set everything up quickly

set -e

echo "🚀 Quick Start: Connecting Agents to Website"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check Python
echo "📋 Step 1: Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found. Please install Python 3.8+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python found${NC}"
echo ""

# Step 2: Install dependencies
echo "📋 Step 2: Installing Python dependencies..."
pip install -q fastapi uvicorn requests crewai crewai-tools
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 3: Get token
echo "📋 Step 3: Getting API token..."
if [ -z "$STACKMONEYUP_PASSWORD" ]; then
    echo -e "${YELLOW}⚠️  STACKMONEYUP_PASSWORD not set${NC}"
    echo "Please set it with:"
    echo "  export STACKMONEYUP_PASSWORD='your-password'"
    echo ""
    read -p "Enter your password: " -s PASSWORD
    export STACKMONEYUP_PASSWORD="$PASSWORD"
    echo ""
fi

TOKEN=$(python3 scripts/get_token.py 2>&1 | grep -A 1 "YOUR API TOKEN" | tail -n 1 | xargs)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Failed to get token${NC}"
    exit 1
fi

export STACKMONEYUP_API_TOKEN="$TOKEN"
echo -e "${GREEN}✅ Token obtained${NC}"
echo ""

# Step 4: Test connection
echo "📋 Step 4: Testing connection..."
if python3 scripts/test_connection.py; then
    echo -e "${GREEN}✅ Connection test passed${NC}"
else
    echo -e "${RED}❌ Connection test failed${NC}"
    exit 1
fi
echo ""

# Step 5: Set environment variables
echo "📋 Step 5: Setting up environment..."
export STACKMONEYUP_URL="${STACKMONEYUP_URL:-https://stackmoneyup.com}"

echo -e "${GREEN}✅ Environment configured${NC}"
echo ""
echo "Environment variables set:"
echo "  STACKMONEYUP_API_TOKEN=${TOKEN:0:20}..."
echo "  STACKMONEYUP_URL=$STACKMONEYUP_URL"
echo ""

# Step 6: Start agent service
echo "📋 Step 6: Starting agent service..."
echo -e "${YELLOW}Starting on http://localhost:8000${NC}"
echo "Press Ctrl+C to stop"
echo ""

python3 scripts/agent_service.py


