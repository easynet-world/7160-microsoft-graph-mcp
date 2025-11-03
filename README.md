# microsoft-graph-mcp

<div align="center">
  <img src="images/microsoft-graph-api-logo.png" alt="Microsoft Graph API" style="width: 100%; max-width: 100%;"/>
</div>

<h2 style="font-size: 1.5em; margin: 1em 0;">🚀 Microsoft Graph MCP Server</h2>

**Microsoft 365 integration for AI assistants** - Connect Cursor, Claude Desktop, and other MCP-compatible tools directly to Microsoft Graph. Access Outlook, OneDrive, Calendar, Teams, and automate workflows with AI.

[![npm version](https://img.shields.io/npm/v/microsoft-graph-mcp)](https://www.npmjs.com/package/microsoft-graph-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-success.svg)](https://modelcontextprotocol.io/)
[![Microsoft Graph](https://img.shields.io/badge/Microsoft%20Graph-API-0078D4.svg)](https://learn.microsoft.com/en-us/graph/overview)
[![Powered by easy-mcp-server](https://img.shields.io/badge/Powered%20by-easy--mcp--server-orange.svg)](https://github.com/easynet-world/7134-easy-mcp-server)

---

## 📊 Microsoft Graph Overview

<img src="images/microsoft-graph-network.png" alt="Microsoft Graph Network" style="width: 100%; max-width: 100%;"/>

Microsoft Graph connects users, their activities, and content across Microsoft 365 services - Teams, Calendar, Files, Mail, People, Tasks, and more. This MCP server provides AI assistants with direct access to this unified data layer.

---

## 🚀 Quick Start

### Run with npx (Recommended)

```bash
AZURE_CLIENT_ID=your-client-id \
AZURE_CLIENT_SECRET=your-client-secret \
AZURE_TENANT_ID=your-tenant-id \
npx microsoft-graph-mcp
```

**That's it!** The server runs on:
- 🌐 **REST API**: http://localhost:8887
- 📚 **API Docs**: http://localhost:8887/docs (Swagger UI)
- 🤖 **MCP Server**: http://localhost:8888

### Run with .env file

Create a `.env` file:

```bash
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id
```

Then run:
```bash
npx microsoft-graph-mcp
```

---

## 📋 Azure Configuration

### Step 1: Create Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in:
   - **Name**: Microsoft Graph MCP Server
   - **Supported account types**: Accounts in this organizational directory only (or Multi-tenant)
   - Click **Register**

### Step 2: Get Credentials

1. **Application (client) ID** → Copy this as `AZURE_CLIENT_ID`
2. **Directory (tenant) ID** → Copy this as `AZURE_TENANT_ID`
3. Go to **Certificates & secrets** → **New client secret**
   - Copy the **secret value** as `AZURE_CLIENT_SECRET` (only shown once!)

### Step 3: Add Application Permissions

1. Go to **API permissions** → **Add a permission** → **Microsoft Graph** → **Application permissions**
2. Add these permissions:
   - `User.Read.All` - Read all users
   - `Mail.Read` - Read mail in all mailboxes
   - `Mail.Send` - Send mail as any user
   - `Calendars.Read` - Read calendars in all mailboxes
   - `Files.Read.All` - Read all files
   - `Group.Read.All` - Read all groups
   - `Contacts.Read` - Read contacts
   - `Tasks.ReadWrite.All` - Read and write tasks
   - `Organization.Read.All` - Read organization information
   - `People.Read.All` - Read people profiles
   - `Application.Read.All` - Read applications
   - `Subscription.Read.All` - Manage subscriptions

3. **⚠️ CRITICAL:** Click **Grant admin consent for [your organization]**

---

## 💻 Use in Cursor / Claude Desktop

### Cursor Configuration

1. Open **Cursor Settings** → **Features** → **Model Context Protocol**
2. Click **"Edit Config"**
3. Add:

```json
{
  "mcpServers": {
    "microsoft-graph-mcp": {
      "command": "npx",
      "args": ["-y", "microsoft-graph-mcp"],
      "env": {
        "AZURE_CLIENT_ID": "your-client-id",
        "AZURE_CLIENT_SECRET": "your-client-secret",
        "AZURE_TENANT_ID": "your-tenant-id"
      }
    }
  }
}
```

### Claude Desktop Configuration

1. Open config file:
   - **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the same configuration as above

3. Restart Claude Desktop

---

## 📡 Using the REST API

Once the server is running, you have full access to Microsoft Graph via REST endpoints.

### 🔍 Interactive API Documentation

**Swagger UI** (Recommended - Visual Interface):
```
http://localhost:8887/docs
```
- Browse all endpoints
- Try requests directly in the browser
- See request/response schemas

**OpenAPI JSON**:
```
http://localhost:8887/openapi.json
```
- Import into Postman, Insomnia, or any OpenAPI-compatible tool

### 📝 Common API Examples

#### Get Users
```bash
curl "http://localhost:8887/graph/users?$top=10"
```

#### Get Email Messages
```bash
curl "http://localhost:8887/graph/mail?userId=user@domain.com&$top=10"
```

#### Send an Email
```bash
curl -X POST http://localhost:8887/graph/mail \
  -H "Content-Type: application/json" \
  -d '{
    "toRecipients": [{"emailAddress": {"address": "user@example.com"}}],
    "subject": "Hello from microsoft-graph-mcp!",
    "body": {"contentType": "text", "content": "This is a test message"}
  }'
```

#### Get Calendar Events
```bash
curl "http://localhost:8887/graph/calendar?userId=user@domain.com&$top=10"
```

#### Create Calendar Event
```bash
curl -X POST http://localhost:8887/graph/calendar/events \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Team Meeting",
    "start": {"dateTime": "2024-01-15T10:00:00", "timeZone": "UTC"},
    "end": {"dateTime": "2024-01-15T11:00:00", "timeZone": "UTC"},
    "userId": "user@domain.com"
  }'
```

#### Get OneDrive Files
```bash
curl "http://localhost:8887/graph/files?userId=user@domain.com&$top=20"
```

#### Get Teams
```bash
curl http://localhost:8887/graph/teams
```

---

## 📚 All Available Endpoints

### Users (6 endpoints)
- `GET /graph/users` - Get list of users (supports filtering, pagination)
- `GET /graph/users/:userId` - Get specific user by ID
- `POST /graph/users` - Create new user
- `PATCH /graph/users/:userId` - Update user
- `DELETE /graph/users/:userId` - Delete user
- `GET /graph/users/:userId/photo` - Get user photo

### Mail (7 endpoints)
- `GET /graph/mail?userId=user@domain.com` - Get email messages (supports filtering)
- `GET /graph/mail/:messageId?userId=user@domain.com` - Get specific message
- `POST /graph/mail` - Send email message
- `POST /graph/mail/:messageId/reply?userId=user@domain.com` - Reply to message
- `POST /graph/mail/:messageId/forward?userId=user@domain.com` - Forward message
- `DELETE /graph/mail/:messageId?userId=user@domain.com` - Delete message
- `GET /graph/mail/folders?userId=user@domain.com` - Get mail folders

### Calendar (5 endpoints)
- `GET /graph/calendar?userId=user@domain.com` - Get calendar events (supports filtering)
- `GET /graph/calendars?userId=user@domain.com` - Get user calendars
- `POST /graph/calendar/events` - Create calendar event (include userId in body)
- `PATCH /graph/calendar/events/:eventId?userId=user@domain.com` - Update calendar event
- `DELETE /graph/calendar/events/:eventId?userId=user@domain.com` - Delete calendar event

### Files/OneDrive (4 endpoints)
- `GET /graph/files?userId=user@domain.com` - Get files and folders from OneDrive
- `GET /graph/drives?userId=user@domain.com` - Get drives (OneDrive and SharePoint)
- `POST /graph/files/upload` - Upload file to OneDrive (include userId in body)
- `DELETE /graph/files/:itemId?userId=user@domain.com` - Delete file or folder

### Groups (3 endpoints)
- `GET /graph/groups` - Get list of groups
- `POST /graph/groups` - Create new group
- `GET /graph/groups/:groupId/members` - Get group members

### Teams (2 endpoints)
- `GET /graph/teams` - Get list of teams
- `GET /graph/teams/:teamId/channels` - Get team channels

### Contacts (2 endpoints)
- `GET /graph/contacts?userId=user@domain.com` - Get contacts
- `POST /graph/contacts` - Create contact (include userId in body)

### Tasks (2 endpoints)
- `GET /graph/tasks?userId=user@domain.com` - Get tasks/to-do items
- `POST /graph/tasks` - Create task (include userId in body)

### Additional Services
- `GET /graph/applications` - Get applications
- `GET /graph/directory` - Get directory objects
- `GET /graph/organization` - Get organization information
- `GET /graph/people?userId=user@domain.com` - Get people (colleagues and contacts)
- `GET /graph/subscriptions` - Get webhook subscriptions
- `POST /graph/subscriptions` - Create webhook subscription

### System
- `GET /health` - Health check
- `GET /api-info` - API information
- `GET /openapi.json` - OpenAPI specification
- `GET /docs` - Swagger UI documentation

**All endpoints are automatically exposed as MCP tools for AI agents to use.**

---

## ⚙️ Advanced Configuration

### Environment Variables

```bash
# Required Azure Configuration
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id

# Optional
AZURE_SCOPE=https://graph.microsoft.com/.default  # Default Microsoft Graph scope
EASY_MCP_SERVER_PORT=8887                        # REST API port (default: 8887)
EASY_MCP_SERVER_MCP_PORT=8888                   # MCP server port (default: 8888)
EASY_MCP_SERVER_LOG_LEVEL=info                   # Logging level (default: info)
```

---

## 🎯 Use Cases

### In Cursor / Claude Desktop
- **"Get my latest emails from Outlook"**
- **"Create a calendar event for tomorrow at 2pm"**
- **"Show me files in my OneDrive"**
- **"List all Microsoft Teams in the organization"**
- **"Send an email to john@example.com about the project update"**
- **"What contacts do I have?"**

### Via REST API
- Build custom Microsoft 365 integrations
- Automate workflows
- Create Microsoft Graph applications
- Integrate with other services

### Via Swagger UI
- Explore endpoints visually
- Test API calls
- Understand request/response formats
- Share API documentation

---

## 🔧 Troubleshooting

### Server won't start
- ✅ Check that port 8887/8888 is not in use
- ✅ Verify your Azure credentials are correct in `.env`
- ✅ Ensure Node.js >= 22.0.0 is installed

### Authentication errors
- ✅ Verify `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID` are correct
- ✅ Check that admin consent has been granted for all required permissions
- ✅ Verify the client secret hasn't expired (create a new one if needed)
- ✅ Ensure permissions are configured as "Application permissions" (not Delegated)

### "Insufficient privileges" errors
- ✅ Verify all required permissions are added in Azure Portal
- ✅ Ensure admin consent has been granted
- ✅ Check that permissions are Application permissions (not Delegated)

### MCP not working in Cursor/Claude
- ✅ Restart Cursor/Claude after adding MCP config
- ✅ Check server is running (`curl http://localhost:8887/health`)
- ✅ Verify environment variables are set correctly
- ✅ Check Cursor/Claude logs for MCP errors

### API calls returning errors
- ✅ Test authentication: `curl http://localhost:8887/graph/users/me`
- ✅ Check Swagger UI: http://localhost:8887/docs
- ✅ Verify Azure app has required permissions
- ✅ Review server logs for detailed error messages

---

## 📖 Learn More

- **Microsoft Graph API**: [https://learn.microsoft.com/en-us/graph/overview](https://learn.microsoft.com/en-us/graph/overview)
- **Model Context Protocol**: [https://modelcontextprotocol.io/](https://modelcontextprotocol.io/)

---

## 📦 Package Info

- **npm**: [microsoft-graph-mcp](https://www.npmjs.com/package/microsoft-graph-mcp)
- **Repository**: [GitHub](https://github.com/easynet-world/7160-microsoft-graph-mcp)
- **License**: MIT

---

## 🆘 Need Help?

1. Check **Swagger UI**: http://localhost:8887/docs
2. Test authentication: `curl http://localhost:8887/graph/users/me`
3. Check server health: `curl http://localhost:8887/health`
4. Review the [Azure Configuration](#-azure-configuration) section above

---

## 🛠️ Development

This MCP server is built using the **easy-mcp-server** framework. 

For development documentation, including:
- How to create custom endpoints
- Project structure and architecture
- Testing and debugging
- Contributing guidelines

👉 **See the [easy-mcp-server documentation](https://github.com/easynet-world/7134-easy-mcp-server) for development details.**

---

## 📦 Package Info

- **npm**: [microsoft-graph-mcp](https://www.npmjs.com/package/microsoft-graph-mcp)
- **Repository**: [GitHub](https://github.com/easynet-world/7160-microsoft-graph-mcp)
- **License**: MIT

---

**Powered by [easy-mcp-server](https://github.com/easynet-world/7134-easy-mcp-server) framework**
