# Test Suite Documentation

This directory contains comprehensive test cases for all Microsoft Graph API endpoints, organized by service category.

## Test Structure

Tests are split into component-based files, one for each Microsoft Graph service:

### Test Files

1. **`test/graph/users.test.ts`** - Tests for Users API (6 endpoints)
   - GET /graph/users (with filtering, pagination)
   - GET /graph/users/me
   - POST /graph/users
   - PATCH /graph/users/:userId
   - DELETE /graph/users/:userId
   - GET /graph/users/:userId/photo

2. **`test/graph/mail.test.ts`** - Tests for Mail API (7 endpoints)
   - GET /graph/mail
   - GET /graph/mail/:messageId
   - POST /graph/mail
   - POST /graph/mail/:messageId/reply
   - POST /graph/mail/:messageId/forward
   - DELETE /graph/mail/:messageId
   - GET /graph/mail/folders

3. **`test/graph/calendar.test.ts`** - Tests for Calendar API (5 endpoints)
   - GET /graph/calendar
   - GET /graph/calendars
   - POST /graph/calendar/events
   - PATCH /graph/calendar/events/:eventId
   - DELETE /graph/calendar/events/:eventId

4. **`test/graph/files.test.ts`** - Tests for Files API (4 endpoints)
   - GET /graph/files
   - GET /graph/drives
   - POST /graph/files/upload
   - DELETE /graph/files/:itemId

5. **`test/graph/groups.test.ts`** - Tests for Groups API (3 endpoints)
   - GET /graph/groups
   - POST /graph/groups
   - GET /graph/groups/:groupId/members

6. **`test/graph/teams.test.ts`** - Tests for Teams API (2 endpoints)
   - GET /graph/teams
   - GET /graph/teams/:teamId/channels

7. **`test/graph/contacts.test.ts`** - Tests for Contacts API (2 endpoints)
   - GET /graph/contacts
   - POST /graph/contacts

8. **`test/graph/tasks.test.ts`** - Tests for Tasks API (2 endpoints)
   - GET /graph/tasks
   - POST /graph/tasks

9. **`test/graph/applications.test.ts`** - Tests for Applications API (1 endpoint)
   - GET /graph/applications

10. **`test/graph/organization.test.ts`** - Tests for Organization/Directory/People APIs (3 endpoints)
    - GET /graph/organization
    - GET /graph/directory
    - GET /graph/people

11. **`test/graph/subscriptions.test.ts`** - Tests for Subscriptions API (2 endpoints)
    - GET /graph/subscriptions
    - POST /graph/subscriptions

## Test Coverage

Each test file covers:
- ✅ **Success scenarios** - Testing successful API calls
- ✅ **Error handling** - Testing authentication errors, validation errors, not found errors
- ✅ **Query parameters** - Testing filtering, pagination, property selection
- ✅ **Request validation** - Testing required fields, data types
- ✅ **Edge cases** - Testing optional parameters, different data formats

## Running Tests

### Run all tests:
```bash
npm test
```

### Run specific test file:
```bash
npm test -- test/graph/users.test.ts
```

### Run with coverage:
```bash
npm test -- --coverage
```

### Run in watch mode:
```bash
npm test -- --watch
```

## Test Configuration

- **Test Framework**: Jest
- **TypeScript Support**: ts-jest
- **HTTP Testing**: supertest
- **Test Timeout**: 10 seconds
- **Coverage Reports**: text, lcov, html

## Environment Setup

Tests automatically set up mock Azure credentials:
- `AZURE_CLIENT_ID=test-client-id`
- `AZURE_CLIENT_SECRET=test-secret`
- `AZURE_TENANT_ID=test-tenant-id`

Note: Tests will attempt actual API calls if real credentials are provided. For isolated unit tests, consider mocking the GraphClient.

## Total Test Coverage

**37+ endpoints tested** across **11 service categories** with **100+ test cases** covering:
- GET operations (list, retrieve by ID)
- POST operations (create)
- PATCH operations (update)
- DELETE operations (delete)
- Query parameters (filter, top, select, search)
- Request body validation
- Error scenarios

