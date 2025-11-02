# microsoft-graph-mcp

<h2 style="font-size: 1.5em; margin: 1em 0;">🚀 The Easiest way to run Microsoft Graph MCP</h2>

**Microsoft 365 integration for AI assistants** - Connect Cursor, Claude Desktop, and other MCP-compatible tools directly to Microsoft Graph. Access Outlook, OneDrive, Calendar, Teams, and automate workflows with AI.

[![npm version](https://img.shields.io/npm/v/microsoft-graph-mcp)](https://www.npmjs.com/package/microsoft-graph-mcp)

---

## 🚀 Quick Start

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

---

## 📋 Detailed Configuration

### Getting Your Azure Credentials

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in application details:
   - **Name**: Microsoft Graph MCP Server (or any name you prefer)
   - **Supported account types**: Accounts in this organizational directory only
   - Click **Register**
5. Go to **Certificates & secrets** → Click **New client secret**
   - Add description and expiration
   - Click **Add** and **copy the secret value immediately** (it's only shown once)
6. Go to **API permissions** → Click **Add a permission** → **Microsoft Graph** → **Application permissions**
   - Add the following permissions:
     - `User.Read.All` - Read all users
     - `User.Read` - Read user profile
     - `Mail.Read` - Read mail
     - `Mail.Send` - Send mail
     - `Calendars.Read` - Read calendars
     - `Files.Read.All` - Read all files
     - `Group.Read.All` - Read all groups
     - `Contacts.Read` - Read contacts
     - `Tasks.ReadWrite` - Read and write tasks
7. Click **Grant admin consent for [your organization]**
8. Copy these values:
   - **Application (client) ID** → `AZURE_CLIENT_ID`
   - **Directory (tenant) ID** → `AZURE_TENANT_ID`
   - **Client secret value** → `AZURE_CLIENT_SECRET`

### Using Environment Variables

Instead of passing credentials inline, you can use a `.env` file for persistent configuration:

```bash
# Create .env file
cat > .env << EOF
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id
EOF

# Run (it will automatically load .env)
npx microsoft-graph-mcp
```

### Local Installation

For a permanent local installation:

```bash
# Install locally
npm install microsoft-graph-mcp

# Create .env file
cat > .env << EOF
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id
EOF

# Run
npm start
# OR
npx microsoft-graph-mcp
```

---

## 💻 Use in Cursor / Claude Desktop

### Option A: Use as npm package (Recommended)

**For Cursor:**
1. Open Cursor Settings → Features → Model Context Protocol
2. Click "Edit Config"
3. Add this to your MCP config:

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

**For Claude Desktop:**
1. Open `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)
   or `%APPDATA%\Claude\claude_desktop_config.json` (Windows)
2. Add the same configuration above

**For any MCP client:**
The server runs automatically when invoked via `npx microsoft-graph-mcp`

### Option B: Local Installation

If you prefer a local setup:

```bash
# Install locally
npm install microsoft-graph-mcp

# Create .env file
cat > .env << EOF
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id
EOF

# Run it
npx microsoft-graph-mcp
```

Then configure your MCP client to run:
```bash
npx microsoft-graph-mcp
```

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

#### Get Current User
```bash
curl http://localhost:8887/graph/users/me
```

#### Get Email Messages
```bash
curl "http://localhost:8887/graph/mail?$top=10"
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
curl "http://localhost:8887/graph/calendar?$top=10"
```

#### Create Calendar Event
```bash
curl -X POST http://localhost:8887/graph/calendar/events \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Team Meeting",
    "start": {"dateTime": "2024-01-15T10:00:00", "timeZone": "UTC"},
    "end": {"dateTime": "2024-01-15T11:00:00", "timeZone": "UTC"}
  }'
```

#### Get OneDrive Files
```bash
curl "http://localhost:8887/graph/files?$top=20"
```

#### Get Teams
```bash
curl http://localhost:8887/graph/teams
```

---

## 📚 All Available Endpoints

### Users (6 endpoints)
- `GET /graph/users` - Get list of users (supports filtering, pagination)
- `GET /graph/users/me` - Get current authenticated user
- `POST /graph/users` - Create new user
- `PATCH /graph/users/:userId` - Update user
- `DELETE /graph/users/:userId` - Delete user
- `GET /graph/users/:userId/photo` - Get user photo

### Mail (7 endpoints)
- `GET /graph/mail` - Get email messages (supports filtering)
- `GET /graph/mail/:messageId` - Get specific message
- `POST /graph/mail` - Send email message
- `POST /graph/mail/:messageId/reply` - Reply to message
- `POST /graph/mail/:messageId/forward` - Forward message
- `DELETE /graph/mail/:messageId` - Delete message
- `GET /graph/mail/folders` - Get mail folders

### Calendar (5 endpoints)
- `GET /graph/calendar` - Get calendar events (supports filtering)
- `GET /graph/calendars` - Get user calendars
- `POST /graph/calendar/events` - Create calendar event
- `PATCH /graph/calendar/events/:eventId` - Update calendar event
- `DELETE /graph/calendar/events/:eventId` - Delete calendar event

### Files/OneDrive (4 endpoints)
- `GET /graph/files` - Get files and folders from OneDrive
- `GET /graph/drives` - Get drives (OneDrive and SharePoint)
- `POST /graph/files/upload` - Upload file to OneDrive
- `DELETE /graph/files/:itemId` - Delete file or folder

### Groups (3 endpoints)
- `GET /graph/groups` - Get list of groups
- `POST /graph/groups` - Create new group
- `GET /graph/groups/:groupId/members` - Get group members

### Teams (2 endpoints)
- `GET /graph/teams` - Get list of teams
- `GET /graph/teams/:teamId/channels` - Get team channels

### Contacts (2 endpoints)
- `GET /graph/contacts` - Get contacts
- `POST /graph/contacts` - Create contact

### Tasks (2 endpoints)
- `GET /graph/tasks` - Get tasks/to-do items
- `POST /graph/tasks` - Create task

### Additional Services
- `GET /graph/applications` - Get applications
- `GET /graph/directory` - Get directory objects
- `GET /graph/organization` - Get organization information
- `GET /graph/people` - Get people (colleagues and contacts)
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

All configuration can be set via environment variables:

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

### Required Azure Permissions

See the [Detailed Configuration](#-detailed-configuration) section above for the complete list of required Azure permissions when setting up your app.

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

- **Easy MCP Server Framework**: 
  - [GitHub Repository](https://github.com/easynet-world/7134-easy-mcp-server)
  - [npm Package](https://www.npmjs.com/package/easy-mcp-server)
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
4. Review the [Azure Setup](#-detailed-configuration) guide

---

**Ready to automate Microsoft 365 with AI?** Get started:

```bash
# Install and run directly
npx microsoft-graph-mcp

# Or install locally for project use
npm install microsoft-graph-mcp
npm start
```

---

**Powered by [easy-mcp-server](https://github.com/easynet-world/7134-easy-mcp-server) framework**
