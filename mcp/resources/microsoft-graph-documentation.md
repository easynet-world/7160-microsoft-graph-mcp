# Microsoft Graph API Documentation

## Overview

This MCP server provides comprehensive access to Microsoft Graph API through REST endpoints and MCP tools. Microsoft Graph is a unified API endpoint for accessing data from Microsoft 365 services including Outlook, OneDrive, Teams, and more.

## Authentication

The server uses Azure AD (Active Directory) authentication with OAuth 2.0 client credentials flow. You need to configure the following environment variables:

- `AZURE_CLIENT_ID` - Your Azure application (client) ID
- `AZURE_CLIENT_SECRET` - Your Azure application client secret
- `AZURE_TENANT_ID` - Your Azure AD tenant ID

### Setting Up Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the application details
5. Go to **Certificates & secrets** and create a new client secret
6. Go to **API permissions** and add the following Microsoft Graph permissions:
   - `User.Read.All` - Read all users
   - `User.Read` - Sign in and read user profile
   - `Mail.Read` - Read user mail
   - `Mail.Send` - Send mail as user
   - `Calendars.Read` - Read user calendars
   - `Files.Read.All` - Read all files
   - Grant admin consent for all permissions

## Available Endpoints

### Users

#### GET /graph/users
Retrieves a list of users from Microsoft Graph.

**Query Parameters:**
- `filter` (optional) - OData filter expression (e.g., `displayName eq 'John'`)
- `top` (optional) - Maximum number of results to return
- `select` (optional) - Comma-separated list of properties to select
- `userId` (optional) - Specific user ID to retrieve (returns single user instead of list)

**Example:**
```
GET /graph/users?filter=displayName eq 'John'&top=10&select=id,displayName,mail
```

#### GET /graph/users/me
Retrieves information about the currently authenticated user.

### Mail

#### GET /graph/mail
Retrieves email messages from the user's mailbox.

**Query Parameters:**
- `userId` (optional) - User ID or principal name (defaults to current user)
- `filter` (optional) - OData filter expression (e.g., `isRead eq false`)
- `top` (optional) - Maximum number of results to return

**Example:**
```
GET /graph/mail?filter=isRead eq false&top=20
```

#### POST /graph/mail
Sends an email message.

**Request Body:**
```json
{
  "subject": "Hello from Microsoft Graph",
  "body": "This is the email body content",
  "bodyContentType": "html",
  "toRecipients": ["recipient@domain.com"],
  "ccRecipients": ["cc@domain.com"],
  "userId": "user@domain.com"
}
```

### Calendar

#### GET /graph/calendar
Retrieves calendar events from the user's calendar.

**Query Parameters:**
- `userId` (optional) - User ID or principal name (defaults to current user)
- `filter` (optional) - OData filter expression
- `top` (optional) - Maximum number of results to return

**Example:**
```
GET /graph/calendar?filter=start/dateTime ge '2024-01-01T00:00:00Z'&top=10
```

### Files (OneDrive)

#### GET /graph/files
Retrieves files and folders from the user's OneDrive.

**Query Parameters:**
- `userId` (optional) - User ID or principal name (defaults to current user)
- `itemPath` (optional) - Path to specific folder (defaults to root)

**Example:**
```
GET /graph/files?itemPath=Documents/Projects
```

## OData Query Parameters

Microsoft Graph supports OData query parameters for filtering, sorting, and selecting data:

- `$filter` - Filter results (e.g., `displayName eq 'John'`)
- `$select` - Select specific properties (e.g., `id,displayName,mail`)
- `$top` - Limit number of results
- `$orderby` - Sort results
- `$skip` - Skip number of results

## Error Handling

The API returns standard HTTP status codes:

- `200` - Success
- `400` - Bad request (invalid parameters)
- `401` - Authentication failed (check Azure credentials)
- `500` - Internal server error

Error responses follow this format:
```json
{
  "error": "Error message description"
}
```

## Rate Limiting

Microsoft Graph API has rate limits. The server implements automatic token caching to minimize authentication requests. If you encounter rate limit errors, implement retry logic with exponential backoff.

## MCP Tools

All API endpoints are automatically exposed as MCP tools, allowing AI agents to interact with Microsoft Graph through the MCP protocol.

## References

- [Microsoft Graph API Documentation](https://learn.microsoft.com/en-us/graph/overview)
- [Microsoft Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
- [OData Query Parameters](https://learn.microsoft.com/en-us/graph/query-parameters)

