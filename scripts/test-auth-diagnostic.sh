#!/bin/bash

# Diagnostic test for authentication issues

BASE_URL="http://localhost:8887"

echo "🔍 Authentication Diagnostic Test"
echo "=================================="
echo ""

echo "1. Testing server health..."
health=$(curl -s http://localhost:8887/health)
echo "   Status: $(echo $health | python3 -c "import json, sys; print(json.load(sys.stdin).get('status', 'unknown'))" 2>/dev/null)"
echo ""

echo "2. Testing authentication with /graph/users/me..."
response=$(curl -s http://localhost:8887/graph/users/me)
error=$(echo "$response" | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('error', 'No error'))" 2>/dev/null)

echo "   Error: $error"
echo ""

if echo "$error" | grep -q "9002346"; then
    echo "❌ Issue Detected: AADSTS9002346"
    echo ""
    echo "This error means your Azure app registration is configured for:"
    echo "   - Microsoft Account users only (personal @outlook.com, @hotmail.com, etc.)"
    echo ""
    echo "However, this MCP server uses Application Permissions (client credentials flow)"
    echo "which requires an ORGANIZATIONAL account (work/school account)."
    echo ""
    echo "📝 To Fix This:"
    echo "   1. Go to Azure Portal → Azure Active Directory → App registrations"
    echo "   2. Select your app: 'microsoft-graph-mcp'"
    echo "   3. Go to 'Authentication' section"
    echo "   4. Under 'Supported account types', select one of:"
    echo "      - ✅ Accounts in this organizational directory only (Single tenant)"
    echo "      - ✅ Accounts in any organizational directory (Multi-tenant)"
    echo "   5. Make sure it's NOT set to 'Microsoft accounts only'"
    echo ""
    echo "After updating, wait a few minutes for changes to propagate."
    echo ""
elif echo "$error" | grep -q "900023"; then
    echo "❌ Issue Detected: Invalid Tenant ID"
    echo ""
    echo "The tenant ID in your .env file is invalid."
    echo "Check your AZURE_TENANT_ID value."
    echo ""
elif echo "$error" | grep -q "7000215\|invalid_client"; then
    echo "❌ Issue Detected: Invalid Client Credentials"
    echo ""
    echo "Check your AZURE_CLIENT_ID and AZURE_CLIENT_SECRET in .env"
    echo ""
elif echo "$response" | python3 -c "import json, sys; data=json.load(sys.stdin); exit(0 if 'id' in data else 1)" 2>/dev/null; then
    echo "✅ Authentication Successful!"
    user=$(echo "$response" | python3 -c "import json, sys; data=json.load(sys.stdin); print(f\"User: {data.get('displayName', 'Unknown')} ({data.get('userPrincipalName', 'N/A')})\")" 2>/dev/null)
    echo "   $user"
    echo ""
else
    echo "⚠️  Unknown authentication issue"
    echo "   Full error: $error"
    echo ""
fi

echo "3. Checking environment configuration..."
if [ -f .env ]; then
    echo "   ✅ .env file exists"
    if grep -q "AZURE_TENANT_ID" .env; then
        tenant_id=$(grep "^AZURE_TENANT_ID" .env | cut -d'=' -f2 | tr -d ' ' | head -c 20)
        if [ ${#tenant_id} -gt 0 ]; then
            echo "   ✅ AZURE_TENANT_ID is set (${tenant_id}...)"
        else
            echo "   ❌ AZURE_TENANT_ID appears empty"
        fi
    else
        echo "   ❌ AZURE_TENANT_ID not found in .env"
    fi
    
    if grep -q "AZURE_CLIENT_ID" .env; then
        client_id=$(grep "^AZURE_CLIENT_ID" .env | cut -d'=' -f2 | tr -d ' ' | head -c 20)
        if [ ${#client_id} -gt 0 ]; then
            echo "   ✅ AZURE_CLIENT_ID is set (${client_id}...)"
        else
            echo "   ❌ AZURE_CLIENT_ID appears empty"
        fi
    else
        echo "   ❌ AZURE_CLIENT_ID not found in .env"
    fi
    
    if grep -q "AZURE_CLIENT_SECRET" .env; then
        secret_length=$(grep "^AZURE_CLIENT_SECRET" .env | cut -d'=' -f2 | wc -c)
        if [ $secret_length -gt 5 ]; then
            echo "   ✅ AZURE_CLIENT_SECRET is set (length: $((secret_length-1)) chars)"
        else
            echo "   ❌ AZURE_CLIENT_SECRET appears empty or too short"
        fi
    else
        echo "   ❌ AZURE_CLIENT_SECRET not found in .env"
    fi
else
    echo "   ❌ .env file not found"
fi

echo ""

