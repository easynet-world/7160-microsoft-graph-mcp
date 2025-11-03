#!/bin/bash

# Diagnostic script to check which permissions are working

BASE_URL="http://localhost:8887"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🔍 Permission Diagnostic Tool"
echo "============================="
echo ""

echo "Testing which permissions are currently granted..."
echo ""

# Test each permission category
WORKING=0
MISSING=0

test_permission() {
    local perm_name=$1
    local endpoint=$2
    
    echo -n "Testing $perm_name... "
    
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint" 2>/dev/null)
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [[ "$http_code" =~ ^2[0-9]{2} ]]; then
        echo -e "${GREEN}✓ WORKING${NC}"
        ((WORKING++))
    elif echo "$body" | grep -q "403\|Authorization_RequestDenied\|Insufficient privileges"; then
        echo -e "${RED}✗ MISSING${NC} (403 Forbidden)"
        echo "  └─ Need to grant: $perm_name (Application Permission)"
        ((MISSING++))
    elif echo "$body" | grep -q "400\|BadRequest"; then
        echo -e "${YELLOW}⚠ ERROR${NC} (400 Bad Request)"
        ((MISSING++))
    else
        echo -e "${YELLOW}⚠ UNKNOWN${NC} (HTTP $http_code)"
        ((MISSING++))
    fi
}

test_permission "User.Read.All" "/graph/users?\$top=1"
test_permission "Organization.Read.All" "/graph/organization"
test_permission "Application.Read.All" "/graph/applications?\$top=1"
test_permission "Group.Read.All" "/graph/groups?\$top=1"
test_permission "Subscription.Read.All" "/graph/subscriptions"

echo ""
echo "=========================================="
echo "📊 Results"
echo "=========================================="
echo -e "${GREEN}Working Permissions: $WORKING${NC}"
echo -e "${RED}Missing Permissions: $MISSING${NC}"
echo ""

if [ $MISSING -gt 0 ]; then
    echo "❌ Some permissions are missing or not granted with admin consent."
    echo ""
    echo "To fix this:"
    echo ""
    echo "1. Go to Azure Portal → Azure Active Directory → App registrations"
    echo "2. Select your app: 'microsoft-graph-mcp'"
    echo "3. Click 'API permissions' in the left menu"
    echo "4. Click 'Add a permission'"
    echo "5. Select 'Microsoft Graph'"
    echo "6. Select 'Application permissions' (NOT Delegated)"
    echo "7. Add these permissions:"
    echo ""
    echo "   - User.Read.All"
    echo "   - Organization.Read.All"
    echo "   - Application.Read.All"
    echo "   - Group.Read.All"
    echo "   - Subscription.Read.All"
    echo ""
    echo "8. ⚠️  CRITICAL: Click 'Grant admin consent for [Your Organization]'"
    echo "9. Wait 2-5 minutes for changes to propagate"
    echo ""
    echo "After granting permissions, run this script again to verify."
else
    echo "✅ All tested permissions are working!"
fi

echo ""

