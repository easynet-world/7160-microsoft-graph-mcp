#!/bin/bash

# Test Microsoft Graph MCP with Real Authentication
# Tests all endpoints with actual Azure credentials

BASE_URL="http://localhost:8887"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🔐 Testing Microsoft Graph MCP with Real Authentication"
echo "========================================================"
echo ""

# Function to test an endpoint with detailed response
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -n "Testing $description... "
    
    if [ "$method" == "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint" 2>/dev/null)
    elif [ "$method" == "POST" ] || [ "$method" == "PATCH" ] || [ "$method" == "PUT" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    elif [ "$method" == "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" 2>/dev/null)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    # Parse response
    if [[ "$http_code" =~ ^2[0-9]{2} ]]; then
        echo -e "${GREEN}✓ SUCCESS${NC} (HTTP $http_code)"
        
        # Try to extract meaningful data
        if echo "$body" | grep -q '"value"'; then
            count=$(echo "$body" | python3 -c "import json, sys; data=json.load(sys.stdin); print(len(data.get('value', [])))" 2>/dev/null || echo "N/A")
            echo "  └─ Found ${count} items"
        elif echo "$body" | grep -q '"id"'; then
            id=$(echo "$body" | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('id', data.get('displayName', 'N/A')))" 2>/dev/null || echo "N/A")
            echo "  └─ ID: ${id}"
        elif echo "$body" | grep -q '"success"'; then
            success=$(echo "$body" | python3 -c "import json, sys; data=json.load(sys.stdin); print('Yes' if data.get('success') else 'No')" 2>/dev/null || echo "N/A")
            echo "  └─ Success: ${success}"
        fi
        return 0
    elif [ "$http_code" == "401" ]; then
        echo -e "${YELLOW}⚠ AUTH REQUIRED${NC} (HTTP $http_code)"
        error=$(echo "$body" | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('error', 'Unknown error')[:100])" 2>/dev/null || echo "Authentication failed")
        echo "  └─ $error"
        return 1
    elif [ "$http_code" == "404" ]; then
        echo -e "${RED}✗ NOT FOUND${NC} (HTTP $http_code)"
        return 1
    elif [ "$http_code" == "403" ]; then
        echo -e "${YELLOW}⚠ FORBIDDEN${NC} (HTTP $http_code) - Permission issue"
        error=$(echo "$body" | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('error', 'Insufficient permissions')[:100])" 2>/dev/null || echo "Insufficient permissions")
        echo "  └─ $error"
        return 1
    else
        echo -e "${RED}✗ ERROR${NC} (HTTP $http_code)"
        error=$(echo "$body" | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('error', 'Unknown error')[:150])" 2>/dev/null || echo "Unknown error")
        echo "  └─ $error"
        return 1
    fi
}

# Track results
PASSED=0
FAILED=0
AUTH_ISSUES=0

# System Endpoints
echo "📋 System Endpoints"
echo "-------------------"
test_endpoint "GET" "/health" "" "Health check" && ((PASSED++)) || ((FAILED++))
echo ""

# Users Endpoints
echo "👥 Users Endpoints"
echo "------------------"
if test_endpoint "GET" "/graph/users/me" "" "Get current user"; then
    ((PASSED++))
    # Extract user info
    response=$(curl -s "$BASE_URL/graph/users/me")
    if echo "$response" | grep -q '"displayName"'; then
        name=$(echo "$response" | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('displayName', 'N/A'))" 2>/dev/null)
        email=$(echo "$response" | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('userPrincipalName', data.get('mail', 'N/A')))" 2>/dev/null)
        echo "  └─ User: $name ($email)"
    fi
else
    ((FAILED++))
    if echo "$response" | grep -q "401\|Authentication"; then
        ((AUTH_ISSUES++))
    fi
fi

if test_endpoint "GET" "/graph/users?\$top=3" "" "Get users list (top 3)"; then
    ((PASSED++))
else
    ((FAILED++))
fi
echo ""

# Mail Endpoints
echo "📧 Mail Endpoints"
echo "----------------"
if test_endpoint "GET" "/graph/mail?\$top=5" "" "Get mail messages (top 5)"; then
    ((PASSED++))
else
    ((FAILED++))
fi

if test_endpoint "GET" "/graph/mail/folders" "" "Get mail folders"; then
    ((PASSED++))
else
    ((FAILED++))
fi
echo ""

# Calendar Endpoints
echo "📅 Calendar Endpoints"
echo "--------------------"
if test_endpoint "GET" "/graph/calendar?\$top=5" "" "Get calendar events (top 5)"; then
    ((PASSED++))
else
    ((FAILED++))
fi

if test_endpoint "GET" "/graph/calendars" "" "Get calendars"; then
    ((PASSED++))
else
    ((FAILED++))
fi
echo ""

# Files/OneDrive Endpoints
echo "📁 Files/OneDrive Endpoints"
echo "---------------------------"
if test_endpoint "GET" "/graph/files?\$top=10" "" "Get files (top 10)"; then
    ((PASSED++))
else
    ((FAILED++))
fi

if test_endpoint "GET" "/graph/drives" "" "Get drives"; then
    ((PASSED++))
else
    ((FAILED++))
fi
echo ""

# Groups Endpoints
echo "👥 Groups Endpoints"
echo "------------------"
if test_endpoint "GET" "/graph/groups?\$top=5" "" "Get groups (top 5)"; then
    ((PASSED++))
else
    ((FAILED++))
fi
echo ""

# Teams Endpoints
echo "👨‍💼 Teams Endpoints"
echo "------------------"
if test_endpoint "GET" "/graph/teams" "" "Get teams"; then
    ((PASSED++))
else
    ((FAILED++))
fi
echo ""

# Contacts Endpoints
echo "📇 Contacts Endpoints"
echo "--------------------"
if test_endpoint "GET" "/graph/contacts?\$top=5" "" "Get contacts (top 5)"; then
    ((PASSED++))
else
    ((FAILED++))
fi
echo ""

# Tasks Endpoints
echo "✅ Tasks Endpoints"
echo "-----------------"
if test_endpoint "GET" "/graph/tasks?\$top=5" "" "Get tasks (top 5)"; then
    ((PASSED++))
else
    ((FAILED++))
fi
echo ""

# Additional Services
echo "🔧 Additional Services"
echo "---------------------"
if test_endpoint "GET" "/graph/organization" "" "Get organization"; then
    ((PASSED++))
else
    ((FAILED++))
fi

if test_endpoint "GET" "/graph/people?\$top=5" "" "Get people (top 5)"; then
    ((PASSED++))
else
    ((FAILED++))
fi

if test_endpoint "GET" "/graph/subscriptions" "" "Get subscriptions"; then
    ((PASSED++))
else
    ((FAILED++))
fi
echo ""

# Summary
echo "=========================================="
echo "📊 Test Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
if [ $AUTH_ISSUES -gt 0 ]; then
    echo -e "${YELLOW}Auth Issues: $AUTH_ISSUES${NC}"
fi
echo ""

if [ $PASSED -gt 0 ] && [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
elif [ $PASSED -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Some tests passed, but some failed${NC}"
    exit 1
else
    echo -e "${RED}❌ All tests failed${NC}"
    exit 1
fi

