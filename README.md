# easy-outlook-mcp

Microsoft Graph MCP Server built with Easy MCP Framework. This project provides comprehensive access to Microsoft Graph API through REST endpoints and MCP tools, enabling AI agents to interact with Microsoft 365 services including Outlook, OneDrive, Calendar, and more.

## Features

- ✅ **Microsoft Graph API Integration** - Full access to Microsoft 365 services
- ✅ **TypeScript Support** - Type-safe implementation with proper annotations
- ✅ **MCP Tools** - All endpoints automatically exposed as MCP tools for AI agents
- ✅ **REST API** - Standard REST endpoints with OpenAPI documentation
- ✅ **Authentication** - Secure OAuth 2.0 client credentials flow
- ✅ **Multiple Services** - Users, Mail, Calendar, Files (OneDrive)

## Microsoft Graph Services

This MCP server provides access to:

- **Users** - Get user information and profiles
- **Mail** - Read and send email messages
- **Calendar** - Access calendar events
- **Files** - Browse OneDrive files and folders

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Azure credentials:
   ```bash
   cp .env.example .env
   # Edit .env and add your Azure credentials:
   # AZURE_CLIENT_ID=your-client-id
   # AZURE_CLIENT_SECRET=your-client-secret
   # AZURE_TENANT_ID=your-tenant-id
   ```

3. Start the server using any of these methods:

   **Using shell script (recommended):**
   ```bash
   ./start.sh
   ```

   **Using npm scripts:**
   ```bash
   npm start
   npm run dev
   ```

   **Direct command:**
   ```bash
   easy-mcp-server
   ```

   **Without installation:**
   ```bash
   npx easy-mcp-server
   ```

## Shell Scripts

This project includes convenient shell scripts for common operations:

- **`./start.sh`** - Start the server
  - Stops existing processes
  - Clears ports if in use
  - Loads environment variables from .env
  - Starts the server with proper configuration

- **`./stop.sh`** - Stop the server
  - Gracefully stops running server processes
  - Cleans up background processes

- **`./build.sh`** - Build npm package
  - Cleans previous builds
  - Installs dependencies
  - Runs tests
  - Creates distributable .tgz package
  - Shows installation instructions

## Available Endpoints

- **Health Check**: `GET /health`
- **API Info**: `GET /api-info`
- **OpenAPI Spec**: `GET /openapi.json`
- **API Documentation**: `GET /docs`

## Microsoft Graph API Endpoints

### Users (10 endpoints)
- `GET /graph/users` - Get list of users (supports filtering, pagination)
- `GET /graph/users/me` - Get current authenticated user
- `POST /graph/users` - Create new user
- `PATCH /graph/users/:userId` - Update user
- `DELETE /graph/users/:userId` - Delete user
- `GET /graph/users/:userId/photo` - Get user photo

### Mail (8 endpoints)
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

### Applications (1 endpoint)
- `GET /graph/applications` - Get applications

### Directory (1 endpoint)
- `GET /graph/directory` - Get directory objects

### Organization (1 endpoint)
- `GET /graph/organization` - Get organization information

### People (1 endpoint)
- `GET /graph/people` - Get people (colleagues and contacts)

### Subscriptions (2 endpoints)
- `GET /graph/subscriptions` - Get webhook subscriptions
- `POST /graph/subscriptions` - Create webhook subscription

**Total: 42+ endpoints covering all major Microsoft Graph services**

All endpoints are automatically exposed as MCP tools for AI agents to use.

## Azure Setup

To use this MCP server, you need to register an application in Azure AD:

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in application details and register
5. Go to **Certificates & secrets** → Create a new client secret
6. Go to **API permissions** → Add Microsoft Graph permissions:
   - `User.Read.All`
   - `User.Read`
   - `Mail.Read`
   - `Mail.Send`
   - `Calendars.Read`
   - `Files.Read.All`
7. Grant admin consent for all permissions
8. Copy the Application (client) ID, Directory (tenant) ID, and client secret to your `.env` file

See `mcp/resources/microsoft-graph-documentation.md` for detailed documentation.

## Adding APIs

Create API files in the `api/` directory using TypeScript. Each file should export a class that extends BaseAPI from easy-mcp-server.

Example API file (`api/example/get.ts`):
```typescript
const { BaseAPI } = require('easy-mcp-server/base-api');
import { Request, Response } from 'express';

// @description('Example API endpoint')
// @summary('Get example data')
// @tags('example')
export default class GetExample extends BaseAPI {
  summary = 'Get example data';
  description = 'Retrieves example data';
  tags = ['example'];

  async process(req: Request, res: Response): Promise<void> {
    res.json({ 
      message: 'Hello from Easy MCP Server!',
      timestamp: Date.now()
    });
  }
}
```

## Environment Variables

Copy `.env.example` to `.env` and configure your authentication credentials:

```bash
cp .env.example .env
# Edit .env with your Azure credentials
```

**Azure Configuration (Required):**
- `AZURE_CLIENT_ID`: Your Azure application (client) ID
  - Get this from: Azure Portal > App registrations > Your app > Overview
- `AZURE_CLIENT_SECRET`: Your Azure application client secret
  - Get this from: Azure Portal > App registrations > Your app > Certificates & secrets
  - **Important**: Create a new client secret and copy the value immediately (it's only shown once)
- `AZURE_TENANT_ID`: Your Azure AD tenant ID
  - Get this from: Azure Portal > Azure Active Directory > Overview > Tenant ID
- `AZURE_SCOPE`: (Optional) Microsoft Graph API scope (defaults to `https://graph.microsoft.com/.default`)

**Server Configuration (Optional):**
- `EASY_MCP_SERVER_PORT`: Server port (default: 8887)
- `EASY_MCP_SERVER_MCP_PORT`: MCP server port (default: 8888)
- `EASY_MCP_SERVER_CORS_ORIGIN`: CORS origin
- `EASY_MCP_SERVER_CORS_METHODS`: Allowed HTTP methods
- `EASY_MCP_SERVER_LOG_LEVEL`: Logging level (default: info)

**Note**: The `.env` file is automatically loaded by the application. You don't need to manually export these variables - just create the `.env` file and the values will be used.

## Building and Publishing as npm Package

This project is configured to be built and published as an npm package:

1. **Build the package:**
   ```bash
   ./build.sh
   # or
   npm run build
   ```

2. **Install locally for testing:**
   ```bash
   npm install ./easy-outlook-mcp-1.0.0.tgz
   ```

3. **Install in another project:**
   ```bash
   cd /path/to/another/project
   npm install /path/to/easy-outlook-mcp-1.0.0.tgz
   ```

4. **Start the installed package with npx:**
   ```bash
   npx easy-mcp-server
   ```

5. **Publish to npm registry:**
   ```bash
   npm publish easy-outlook-mcp-1.0.0.tgz
   ```

## Learn More

- [Easy MCP Server Documentation](https://github.com/easynet-world/7134-easy-mcp-server)
- [Model Context Protocol](https://modelcontextprotocol.io/)

