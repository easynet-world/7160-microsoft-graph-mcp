# API Classes Guide for Easy MCP Server

## Overview

The `easy-mcp-server` framework uses class definitions to automatically generate:
- **OpenAPI/Swagger documentation**
- **MCP tool input/output schemas**
- **Request/response validation**

**⚠️ IMPORTANT:** The framework requires classes to be named exactly `Request` and `Response` to identify them automatically.

## When to Define Classes

### ✅ GET Endpoints

**With Query Parameters:**
```typescript
// @description('Request parameters for getting users')
// MUST be named "Request" for framework to identify it
class Request {
  // @description('OData filter expression')
  filter?: string;
  
  // @description('Maximum number of results')
  top?: number;
}

// @description('Response containing users')
// MUST be named "Response" for framework to identify it
class Response {
  // @description('Array of users')
  value: User[];
}

function handler(req: any, res: any) {
  // Use req.query for GET parameters
  const { filter, top } = req.query;
  // ...
}
```

**Without Query Parameters:**
```typescript
// Only Response is needed
// @description('Current user information')
class Response {
  // @description('User ID')
  id: string;
  // ...
}

function handler(req: any, res: any) {
  // No query params needed
  // ...
}
```

### ✅ POST/PATCH/PUT Endpoints

```typescript
// @description('Request body for creating a user')
class Request {
  // @description('Display name')
  displayName: string;
  
  // @description('Email address')
  mail: string;
}

// @description('Create user response')
class Response {
  // @description('Created user ID')
  id: string;
  
  // @description('Success status')
  success: boolean;
}

function handler(req: any, res: any) {
  // Use req.body for request data
  const { displayName, mail } = req.body;
  // ...
}
```

### ✅ DELETE Endpoints

**Without Parameters:**
```typescript
// Only Response is needed
// @description('Delete user response')
class Response {
  // @description('Success status')
  success: boolean;
  
  // @description('Response message')
  message: string;
}

function handler(req: any, res: any) {
  // Only path params (from req.params)
  const { userId } = req.params;
  // ...
}
```

**With Optional Parameters:**
```typescript
// Use Request class for optional parameters (via query string)
// @description('Request parameters for deleting an event')
// MUST be named "Request" for framework to identify it
class Request {
  // @description('User ID (optional)')
  userId?: string;
}

// @description('Delete event response')
// MUST be named "Response" for framework to identify it
class Response {
  success: boolean;
  message: string;
}

function handler(req: any, res: any) {
  // Path params from req.params, optional params from req.query
  const { eventId } = req.params;
  const { userId } = req.query; // NOT req.body
  // ...
}
```

## Class Naming Conventions

**⚠️ REQUIRED:** Classes must be named exactly:
- **`Request`** - For ALL input (GET query parameters, POST/PATCH/PUT request body, DELETE optional params)
- **`Response`** - For ALL output (always needed for the response schema)

The framework uses these exact class names to automatically identify and generate documentation.

## Best Practices

1. **Always define `Response` class** - Needed for OpenAPI documentation and MCP tools
2. **Always use `Request` class name** - For GET query parameters, POST/PATCH/PUT body, or DELETE optional params
3. **The framework identifies by class name** - Must be exactly `Request` and `Response`
4. **GET endpoints** - Use `Request` class for query parameters (even though they come from `req.query`)
5. **POST/PATCH/PUT endpoints** - Use `Request` class for request body (from `req.body`)
6. **DELETE endpoints** - Use `Request` class for optional query parameters (from `req.query`)
7. **Add `@description` annotations** - These appear in API documentation
8. **Use optional properties (`?`)** - For non-required fields

## Examples from This Project

### ✅ Correct: GET with Request (for query params)
```typescript
// api/graph/users/get.ts
// Note: Even though these are query params, use "Request" class name
class Request {
  filter?: string;
  top?: number;
}

class Response {
  value: User[];
}
```

### ✅ Correct: POST with Request Body
```typescript
// api/graph/mail/post.ts
class Request {
  subject: string;
  toRecipients: string[];
}

class Response {
  success: boolean;
  message: string;
}
```

### ✅ Correct: GET without Parameters
```typescript
// api/graph/users/me/get.ts
class Response {
  id: string;
  displayName: string;
}
// No Query class needed - endpoint takes no parameters
```

### ✅ Correct: DELETE with Optional Query Param
```typescript
// api/graph/calendar/events/[eventId]/delete.ts
// Note: Use "Request" class name even for query parameters
class Request {
  userId?: string; // Optional parameter via query string
}

class Response {
  success: boolean;
  message: string;
}
```

## Summary Table

| HTTP Method | Has Input? | Needed Classes | Input Source |
|------------|-----------|----------------|--------------|
| GET | Query params | `Request` + `Response` | `req.query` |
| GET | No params | `Response` only | N/A |
| POST/PATCH/PUT | Request body | `Request` + `Response` | `req.body` |
| DELETE | No params | `Response` only | N/A |
| DELETE | Optional params | `Request` + `Response` | `req.query` |

**⚠️ Important Notes:**
- Always use exactly `Request` and `Response` as class names (framework requirement)
- For GET endpoints, `Request` class represents query parameters (accessed via `req.query`)
- Always define at least the `Response` class for proper OpenAPI documentation generation
- The framework automatically detects these class names to generate documentation and MCP tool schemas

