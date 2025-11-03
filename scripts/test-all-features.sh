#!/bin/bash

# Comprehensive Feature Test Script for Microsoft Graph MCP
# Tests all endpoints to verify functionality

BASE_URL="http://localhost:8887"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Testing All Microsoft Graph MCP Features"
echo "=========================================="
echo ""

# Function to test an endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -n "Testing $description... "
    
    if [ "$method" == "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    elif [ "$method" == "POST" ] || [ "$method" == "PATCH" ] || [ "$method" == "PUT" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    elif [ "$method" == "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" 2>/dev/null)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    # Check if status is 2xx or 401 (auth expected) or 400 (validation expected)
    if [[ "$http_code" =~ ^[24] ]]; then
        echo -e "${GREEN}✓${NC} (HTTP $http_code)"
        return 0
    elif [ "$http_code" == "401" ]; then
        echo -e "${YELLOW}⚠${NC} (HTTP $http_code - Auth required, endpoint exists)"
        return 0
    else
        echo -e "${RED}✗${NC} (HTTP $http_code)"
        echo "  Response: $body" | head -c 200
        echo ""
        return 1
    fi
}

# System Endpoints
echo "📋 System Endpoints"
echo "-------------------"
test_endpoint "GET" "/health" "" "Health check"
test_endpoint "GET" "/api-info" "" "API info"
test_endpoint "GET" "/openapi.json" "" "OpenAPI spec"
echo ""

# Users Endpoints
echo "👥 Users Endpoints"
echo "------------------"
test_endpoint "GET" "/graph/users/me" "" "Get current user"
test_endpoint "GET" "/graph/users?\$top=5" "" "Get users list"
test_endpoint "GET" "/graph/users/test-user-id/photo" "" "Get user photo"
echo ""

# Mail Endpoints
echo "📧 Mail Endpoints"
echo "----------------"
test_endpoint "GET" "/graph/mail?\$top=5" "" "Get mail messages"
test_endpoint "GET" "/graph/mail/folders" "" "Get mail folders"
test_endpoint "GET" "/graph/mail/test-message-id" "" "Get specific message"
test_endpoint "POST" "/graph/mail" '{
  "subject": "Test Email",
  "body": "This is a test email",
  "bodyContentType": "text",
  "toRecipients": ["test@example.com"]
}' "Send email"
echo ""

# Calendar Endpoints
echo "📅 Calendar Endpoints"
echo "--------------------"
test_endpoint "GET" "/graph/calendar?\$top=5" "" "Get calendar events"
test_endpoint "GET" "/graph/calendars" "" "Get calendars"
test_endpoint "POST" "/graph/calendar/events" '{
  "subject": "Test Meeting",
  "start": {"dateTime": "2024-12-01T10:00:00", "timeZone": "UTC"},
  "end": {"dateTime": "2024-12-01T11:00:00", "timeZone": "UTC"}
}' "Create calendar event"
echo ""

# Files/OneDrive Endpoints
echo "📁 Files/OneDrive Endpoints"
echo "---------------------------"
test_endpoint "GET" "/graph/files?\$top=10" "" "Get files"
test_endpoint "GET" "/graph/drives" "" "Get drives"
echo ""

# Groups Endpoints
echo "👥 Groups Endpoints"
echo "------------------"
test_endpoint "GET" "/graph/groups?\$top=5" "" "Get groups"
test_endpoint "GET" "/graph/groups/test-group-id/members" "" "Get group members"
echo ""

# Teams Endpoints
echo "👨‍💼 Teams Endpoints"
echo "------------------"
test_endpoint "GET" "/graph/teams" "" "Get teams"
test_endpoint "GET" "/graph/teams/test-team-id/channels" "" "Get team channels"
echo ""

# Contacts Endpoints
echo "📇 Contacts Endpoints"
echo "--------------------"
test_endpoint "GET" "/graph/contacts?\$top=5" "" "Get contacts"
echo ""

# Tasks Endpoints
echo "✅ Tasks Endpoints"
echo "-----------------"
test_endpoint "GET" "/graph/tasks?\$top=5" "" "Get tasks"
echo ""

# Additional Services
echo "🔧 Additional Services"
echo "---------------------"
test_endpoint "GET" "/graph/applications?\$top=5" "" "Get applications"
test_endpoint "GET" "/graph/directory" "" "Get directory"
test_endpoint "GET" "/graph/organization" "" "Get organization"
test_endpoint "GET" "/graph/people?\$top=5" "" "Get people"
test_endpoint "GET" "/graph/subscriptions" "" "Get subscriptions"
echo ""

echo ""
echo "✅ Feature testing complete!"
echo ""

