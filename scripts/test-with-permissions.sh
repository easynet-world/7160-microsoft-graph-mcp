#!/bin/bash

# Comprehensive test with permissions and user IDs

BASE_URL="http://localhost:8887"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0

echo "🧪 Comprehensive Feature Test with Permissions"
echo "=============================================="
echo ""

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=${4:-""}
    
    echo -n "Testing $description... "
    
    if [ "$method" == "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    fi
    
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

# Test endpoints that don't require /me
echo "📋 Endpoints Not Requiring /me"
echo "-------------------------------"

test_endpoint "GET" "/health" "Health check"
test_endpoint "GET" "/api-info" "API info"
test_endpoint "GET" "/graph/subscriptions" "Subscriptions"

# Test organization endpoint
echo ""
echo "🏢 Organization & Directory"
echo "--------------------------"
test_endpoint "GET" "/graph/organization" "Get organization info"
test_endpoint "GET" "/graph/directory" "Get directory"
test_endpoint "GET" "/graph/applications?\$top=3" "Get applications"

# Test users endpoint (might need User.Read.All)
echo ""
echo "👥 Users"
echo "-------"
test_endpoint "GET" "/graph/users?\$top=3" "Get users list"

# Try to get a user ID for testing
USER_RESPONSE=$(curl -s "http://localhost:8887/graph/users?\$top=1")
USER_ID=""
if echo "$USER_RESPONSE" | grep -q '"value"'; then
    USER_ID=$(echo "$USER_RESPONSE" | python3 -c "import json, sys; data=json.load(sys.stdin); users=data.get('value',[]); print(users[0].get('id', users[0].get('userPrincipalName', '')) if users else '')" 2>/dev/null)
    if [ ! -z "$USER_ID" ]; then
        echo -e "${BLUE}ℹ Using user ID: $USER_ID${NC}"
        echo ""
        
        # Test endpoints with user ID
        echo "📧 Mail (with user ID)"
        echo "---------------------"
        test_endpoint "GET" "/graph/mail?userId=$USER_ID&\$top=3" "Get mail messages"
        test_endpoint "GET" "/graph/mail/folders?userId=$USER_ID" "Get mail folders"
        
        echo ""
        echo "📅 Calendar (with user ID)"
        echo "------------------------"
        test_endpoint "GET" "/graph/calendar?userId=$USER_ID&\$top=3" "Get calendar events"
        test_endpoint "GET" "/graph/calendars?userId=$USER_ID" "Get calendars"
        
        echo ""
        echo "📁 Files (with user ID)"
        echo "---------------------"
        test_endpoint "GET" "/graph/files?userId=$USER_ID&\$top=5" "Get files"
        test_endpoint "GET" "/graph/drives?userId=$USER_ID" "Get drives"
        
        echo ""
        echo "📇 Contacts & People (with user ID)"
        echo "-----------------------------------"
        test_endpoint "GET" "/graph/contacts?userId=$USER_ID&\$top=5" "Get contacts"
        test_endpoint "GET" "/graph/people?userId=$USER_ID&\$top=5" "Get people"
        
        echo ""
        echo "✅ Tasks (with user ID)"
        echo "----------------------"
        test_endpoint "GET" "/graph/tasks?userId=$USER_ID&\$top=5" "Get tasks"
    else
        echo -e "${YELLOW}⚠ Could not extract user ID - cannot test /me endpoints${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Cannot get users list - User.Read.All permission may be missing${NC}"
    echo "   Cannot test endpoints that require user ID"
fi

# Test groups
echo ""
echo "👥 Groups"
echo "--------"
test_endpoint "GET" "/graph/groups?\$top=3" "Get groups"

# Test teams
echo ""
echo "👨‍💼 Teams"
echo "-------"
test_endpoint "GET" "/graph/teams" "Get teams"

# Summary
echo ""
echo "=========================================="
echo "📊 Test Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $PASSED -gt $FAILED ]; then
    echo -e "${GREEN}✅ Most tests passed!${NC}"
    if [ $FAILED -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Some endpoints may need additional permissions${NC}"
    fi
elif [ $PASSED -eq 0 ]; then
    echo -e "${RED}❌ All tests failed - check permissions${NC}"
else
    echo -e "${YELLOW}⚠️  Mixed results - check permissions and configuration${NC}"
fi

