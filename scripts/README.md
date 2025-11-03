# Test Scripts

This directory contains utility scripts for testing and verifying the Microsoft Graph MCP server.

## Available Scripts

### `check-permissions.sh`
Diagnostic tool to check which Application Permissions are currently working.

```bash
./scripts/check-permissions.sh
```

### `test-real-auth.sh`
Comprehensive test suite for all endpoints with real authentication.

```bash
./scripts/test-real-auth.sh
```

### `test-with-permissions.sh`
Tests endpoints that require Application Permissions.

```bash
./scripts/test-with-permissions.sh
```

### `test-all-with-userid.sh`
Tests endpoints using a specific user ID parameter.

```bash
./scripts/test-all-with-userid.sh
```

### `test-all-features.sh`
Basic endpoint availability test (checks if endpoints respond).

```bash
./scripts/test-all-features.sh
```

### `test-auth-diagnostic.sh`
Diagnostic script to identify authentication issues.

```bash
./scripts/test-auth-diagnostic.sh
```

## Usage

All scripts should be run from the project root directory:

```bash
cd /path/to/microsoft-graph-mcp
./scripts/check-permissions.sh
```

