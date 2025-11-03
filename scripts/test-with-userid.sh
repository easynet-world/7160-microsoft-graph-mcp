#!/bin/bash

# Test endpoints that require user ID parameter (not /me)

BASE_URL="http://localhost:8887"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🧪 Testing Endpoints with User ID Parameter"
echo "==========================================="
echo ""
echo "Note: These tests require a valid user ID from your organization"
echo ""

# Try to get a user ID first
echo "1. Attempting to get user list..."
USER_RESPONSE=$(curl -s "http://localhost:8887/graph/users?\$top=1")

if echo "$USER_RESPONSE" | grep -q '"value"'; then
    USER_ID=$(echo "$USER_RESPONSE" | python3 -c "import json, sys; data=json.load(sys.stdin); users=data.get('value',[]); print(users[0].get('id', '') if users else '')" 2>/dev/null)
    USER_EMAIL=$(echo "$USER_RESPONSE" | python3 -c "import json, sys; data=json.load(sys.stdin); users=data.get('value',[]); print(users[0].get('userPrincipalName', '') if users else '')" 2>/dev/null)
    
    if [ ! -z "$USER_ID" ]; then
        echo -e "   ${GREEN}✓ Found user: $USER_EMAIL${NC}"
        echo "   Using user ID: $USER_ID"
        echo ""
        
        echo "2. Testing endpoints with user ID..."
        echo ""
        
        # Test mail with user ID
        echo -n "   Testing mail messages (with user ID)... "
        MAIL_RESPONSE=$(curl -s "http://localhost:8887/graph/mail?userId=$USER_ID&\$top=2")
        if echo "$MAIL_RESPONSE" | grep -q '"value"'; then
            COUNT=$(echo "$MAIL_RESPONSE" | python3 -c "import json, sys; data=json.load(sys.stdin); print(len(data.get('value', [])))" 2>/dev/null)
            echo -e "${GREEN}✓${NC} Found $COUNT messages"
        elif echo "$MAIL_RESPONSE" | grep -q "403\|Insufficient"; then
            echo -e "${YELLOW}⚠${NC} Permission denied (need Mail.Read permission)"
        else
            ERROR=$(echo "$MAIL_RESPONSE" | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('error', 'Unknown')[:80])" 2>/dev/null)
            echo -e "${RED}✗${NC} $ERROR"
        fi
        
        # Test mail folders with user ID
        echo -n "   Testing mail folders (with user ID)... "
        FOLDERS_RESPONSE=$(curl -s "http://localhost:8887/graph/mail/folders?userId=$USER_ID")
        if echo "$FOLDERS_RESPONSE" | grep -q '"value"'; then
            COUNT=$(echo "$FOLDERS_RESPONSE" | python3 -c "import json, sys; data=json.load(sys.stdin); print(len(data.get('value', [])))" 2>/dev/null)
            echo -e "${GREEN}✓${NC} Found $COUNT folders"
        elif echo "$FOLDERS_RESPONSE" | grep -q "403\|Insufficient"; then
            echo -e "${YELLOW}⚠${NC} Permission denied (need Mail.Read permission)"
        else
            echo -e "${RED}✗${NC} Failed"
        fi
        
        # Test calendar with user ID
        echo -n "   Testing calendar events (with user ID)... "
        CAL_RESPONSE=$(curl -s "http://localhost:8887/graph/calendar?userId=$USER_ID&\$top=2")
        if echo "$CAL_RESPONSE" | grep -q '"value"'; then
            COUNT=$(echo "$CAL_RESPONSE" | python3 -c "import json, sys; data=json.load(sys.stdin); print(len(data.get('value', [])))" 2>/dev/null)
            echo -e "${GREEN}✓${NC} Found $COUNT events"
        elif echo "$CAL_RESPONSE" | grep -q "403\|Insufficient"; then
            echo -e "${YELLOW}⚠${NC} Permission denied (need Calendars.Read permission)"
        else
            echo -e "${RED}✗${NC} Failed"
        fi
        
        # Test files with user ID
        echo -n "   Testing files (with user ID)... "
        FILES_RESPONSE=$(curl -s "http://localhost:8887/graph/files?userId=$USER_ID&\$top=5")
        if echo "$FILES_RESPONSE" | grep -q '"value"'; then
            COUNT=$(echo "$FILES_RESPONSE" | python3 -c "import json, sys; data=json.load(sys.stdin); print(len(data.get('value', [])))" 2>/dev/null)
            echo -e "${GREEN}✓${NC} Found $COUNT items"
        elif echo "$FILES_RESPONSE" | grep -q "403\|Insufficient"; then
            echo -e "${YELLOW}⚠${NC} Permission denied (need Files.Read.All permission)"
        else
            echo -e "${RED}✗${NC} Failed"
        fi
        
        # Test contacts with user ID
        echo -n "   Testing contacts (with user ID)... "
        CONTACTS_RESPONSE=$(curl -s "http://localhost:8887/graph/contacts?userId=$USER_ID&\$top=5")
        if echo "$CONTACTS_RESPONSE" | grep -q '"value"'; then
            COUNT=$(echo "$CONTACTS_RESPONSE" | python3 -c "import json, sys; data=json.load(sys.stdin); print(len(data.get('value', [])))" 2>/dev/null)
            echo -e "${GREEN}✓${NC} Found $COUNT contacts"
        elif echo "$CONTACTS_RESPONSE" | grep -q "403\|Insufficient"; then
            echo -e "${YELLOW}⚠${NC} Permission denied (need Contacts.Read permission)"
        else
            echo -e "${RED}✗${NC} Failed"
        fi
        
    else
        echo -e "   ${RED}✗ Could not extract user ID${NC}"
    fi
else
    echo -e "   ${RED}✗ Cannot get users list${NC}"
    ERROR=$(echo "$USER_RESPONSE" | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('error', 'Unknown error')[:100])" 2>/dev/null)
    echo "   Error: $ERROR"
    echo ""
    echo "   ${YELLOW}Note:${NC} To test endpoints with user ID, you need:"
    echo "   - User.Read.All application permission"
    echo "   - Admin consent granted in Azure Portal"
fi

echo ""
echo "=========================================="

