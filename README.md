# Microsoft Graph MCP

> **The easiest way to run Microsoft Graph MCP**

Microsoft Graph MCP Server built with Easy MCP Framework. This project provides comprehensive access to Microsoft Graph API through REST endpoints and MCP tools, enabling AI agents to interact with Microsoft 365 services including Outlook, OneDrive, Calendar, and more.

## Features

- ✅ **Microsoft Graph API Integration** - Full access to Microsoft 365 services
- ✅ **MCP Tools** - All endpoints automatically exposed as MCP tools for AI agents
- ✅ **REST API** - Standard REST endpoints with OpenAPI documentation
- ✅ **Secure Authentication** - OAuth 2.0 client credentials flow
- ✅ **42+ Endpoints** - Users, Mail, Calendar, Files, Teams, Groups, Contacts, Tasks, and more

## Microsoft Graph Services

This MCP server provides access to:

- **Users** - Get user information and profiles
- **Mail** - Read and send email messages
- **Calendar** - Access and manage calendar events
- **Files** - Browse OneDrive files and folders
- **Groups** - Manage groups and memberships
- **Teams** - Access Microsoft Teams information
- **Contacts** - Manage contacts and address books
- **Tasks** - Create and manage to-do items
- **Subscriptions** - Set up webhook subscriptions

## Installation

### Option 1: Install from npm (Recommended)

```bash
npm install microsoft-graph-mcp
```

### Option 2: Install from Source

```bash
git clone https://github.com/easynet-world/7160-microsoft-graph-mcp.git
cd microsoft-graph-mcp
npm install
```

## Quick Start

### 1. Configure Azure Credentials

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Azure credentials:

```bash
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id
```

### 2. Start the Server

**Using npm package (after installation):**
```bash
npm start
# or
npx microsoft-graph-mcp
```

**Using shell script (if installed from source):**
```bash
./start.sh
```

**Using npm scripts:**
```bash
npm run dev
```

**Without installation:**
```bash
npx easy-mcp-server
```

The server will start on port `8887` (REST API) and `8888` (MCP server).

### 3. Access the API

- **API Documentation**: `http://localhost:8887/docs`
- **OpenAPI Spec**: `http://localhost:8887/openapi.json`
- **Health Check**: `http://localhost:8887/health`

## Azure Setup

To use this MCP server, you need to register an application in Azure AD:

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
     - `User.Read.All`
     - `User.Read`
     - `Mail.Read`
     - `Mail.Send`
     - `Calendars.Read`
     - `Files.Read.All`
     - `Group.Read.All`
     - `Contacts.Read`
     - `Tasks.ReadWrite`
7. Click **Grant admin consent for [your organization]**
8. Copy these values to your `.env` file:
   - **Application (client) ID** → `AZURE_CLIENT_ID`
   - **Directory (tenant) ID** → `AZURE_TENANT_ID`
   - **Client secret value** → `AZURE_CLIENT_SECRET`

## Environment Variables

Required Azure configuration:

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `AZURE_CLIENT_ID` | Azure application client ID | Azure Portal > App registrations > Your app > Overview |
| `AZURE_CLIENT_SECRET` | Azure application client secret | Azure Portal > App registrations > Your app > Certificates & secrets |
| `AZURE_TENANT_ID` | Azure AD tenant ID | Azure Portal > Azure Active Directory > Overview > Tenant ID |
| `AZURE_SCOPE` | (Optional) Microsoft Graph API scope | Defaults to `https://graph.microsoft.com/.default` |

Optional server configuration:

| Variable | Default | Description |
|----------|---------|-------------|
| `EASY_MCP_SERVER_PORT` | `8887` | REST API server port |
| `EASY_MCP_SERVER_MCP_PORT` | `8888` | MCP server port |
| `EASY_MCP_SERVER_LOG_LEVEL` | `info` | Logging level |

**Note**: The `.env` file is automatically loaded. You don't need to manually export these variables.

## Available API Endpoints

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

**All endpoints are automatically exposed as MCP tools for AI agents to use.**

## Usage Examples

### Using REST API

```bash
# Get current user
curl http://localhost:8887/graph/users/me

# Get email messages
curl http://localhost:8887/graph/mail

# Get calendar events
curl http://localhost:8887/graph/calendar
```

### Using MCP Tools

When connected as an MCP server, all endpoints are available as tools that AI agents can call directly. The server automatically exposes each endpoint as an MCP tool with proper descriptions and parameters.

## Server Management

If installed from source, you can use these convenience scripts:

- **`./start.sh`** - Start the server (stops existing processes, clears ports)
- **`./stop.sh`** - Stop the server gracefully

## Learn More

- [Easy MCP Server Documentation](https://github.com/easynet-world/7134-easy-mcp-server)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Microsoft Graph API Documentation](https://learn.microsoft.com/en-us/graph/overview)

## License

MIT
