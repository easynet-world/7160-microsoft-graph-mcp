#!/bin/bash

# Comprehensive test with user ID parameter

BASE_URL="http://localhost:8887"
USER_ID="cdb04134-bdeb-4b46-94b0-8c5e451531af"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

echo "🧪 Comprehensive Feature Test with User ID"
echo "==========================================="
echo "Using User ID: $USER_ID"
echo ""

test_endpoint() {
    local endpoint=$1
    local description=$2
    
    echo -n "Testing $description... "
    
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint" 2>/dev/null)
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [[ "$http_code" =~ ^2[0-9]{2} ]]; then
        echo -e "${GREEN}✓ SUCCESS${NC} (HTTP $http_code)"
        if echo "$body" | grep -q '"value"'; then
            count=$(echo "$body" | python3 -c "import json, sys; data=json.load(sys.stdin); print(len(data.get('value', [])))" 2>/dev/null || echo "0")
            echo "  └─ Found $count items"
        fi
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
        error=$(echo "$body" | python3 -c "import json, sys; data=json.load(sys.stdin); err=data.get('error', ''); print(err[:100] if isinstance(err, str) else str(err)[:100])" 2>/dev/null || echo "Unknown error")
        echo "  └─ $error"
        ((FAILED++))
        return 1
    fi
}

# System
echo "📋 System"
echo "---------"
test_endpoint "/health" "Health check"
test_endpoint "/api-info" "API info"
echo ""

# Users
echo "👥 Users"
echo "--------"
test_endpoint "/graph/users?\$top=3" "Get users list"
test_endpoint "/graph/users/me" "Get current user (/me - will fail)"
echo ""

# Mail
echo "📧 Mail"
echo "------"
test_endpoint "/graph/mail?userId=$USER_ID&\$top=5" "Get mail messages"
test_endpoint "/graph/mail/folders?userId=$USER_ID" "Get mail folders"
echo ""

# Calendar
echo "📅 Calendar"
echo "-----------"
test_endpoint "/graph/calendar?userId=$USER_ID&\$top=5" "Get calendar events"
test_endpoint "/graph/calendars?userId=$USER_ID" "Get calendars"
echo ""

# Contacts
echo "📇 Contacts"
echo "-----------"
test_endpoint "/graph/contacts?userId=$USER_ID&\$top=5" "Get contacts"
echo ""

# People
echo "👤 People"
echo "---------"
test_endpoint "/graph/people?userId=$USER_ID&\$top=5" "Get people"
echo ""

# Tasks
echo "✅ Tasks"
echo "-------"
test_endpoint "/graph/tasks?userId=$USER_ID&\$top=5" "Get tasks"
echo ""

# Groups
echo "👥 Groups"
echo "--------"
test_endpoint "/graph/groups?\$top=5" "Get groups"
echo ""

# Organization
echo "🏢 Organization"
echo "--------------"
test_endpoint "/graph/organization" "Get organization"
echo ""

# Applications
echo "📱 Applications"
echo "--------------"
test_endpoint "/graph/applications?\$top=5" "Get applications"
echo ""

# Subscriptions
echo "📡 Subscriptions"
echo "---------------"
test_endpoint "/graph/subscriptions" "Get subscriptions"
echo ""

# Summary
echo "=========================================="
echo "📊 Test Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $PASSED -gt $FAILED ]; then
    echo -e "${GREEN}✅ Most tests passed!${NC}"
elif [ $PASSED -eq 0 ]; then
    echo -e "${RED}❌ All tests failed${NC}"
else
    echo -e "${YELLOW}⚠️  Mixed results${NC}"
fi

