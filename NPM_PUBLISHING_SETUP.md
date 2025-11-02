# NPM Publishing Setup Guide

## Current Status

✅ **Package configured for npm publishing**
- Package name: `microsoft-graph-mcp`
- Current version: `0.0.1`
- Initial tag: `v0.0.1` (created)

## Required Setup Steps

### 1. Create NPM Access Token

1. Go to https://www.npmjs.com/
2. Log in to your npm account
3. Click your profile → Access Tokens → Generate New Token
4. Choose "Automation" token type (for CI/CD)
5. Copy the token immediately (it's only shown once)

### 2. Add NPM_TOKEN to GitHub Secrets

1. Go to: https://github.com/easynet-world/7160-microsoft-graph-mcp/settings/secrets/actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: Paste your npm access token
5. Click "Add secret"

### 3. Verify Configuration

The workflow is configured to:
- ✅ Publish to npm (`npmPublish: true`)
- ✅ Only release patches (0.0.1 → 0.0.2 → 0.0.3, etc.)
- ✅ Release on `fix:`, `perf:`, or `refactor:` commits

## How It Works

When you push a commit with a release-triggering type:

```bash
git commit -m "fix: Fix authentication bug"
git push origin main
```

The workflow will:
1. Run tests
2. Analyze commits since last release
3. If changes detected, create:
   - GitHub release (e.g., v0.0.2)
   - NPM package version (e.g., 0.0.2)
   - Git tag (e.g., v0.0.2)

## Test Release

To trigger the first npm release after setting up NPM_TOKEN:

```bash
git commit --allow-empty -m "fix: Initial npm release setup"
git push origin main
```

This will create version 0.0.2 and publish it to npm.

## Troubleshooting

### Issue: "NPM_TOKEN not set"
- Solution: Add the NPM_TOKEN secret in GitHub repository settings

### Issue: "No new release needed"
- This means there are no qualifying commits (`fix:`, `perf:`, `refactor:`) since the last release
- Make a commit with one of these prefixes to trigger a release

### Issue: "Package name already exists"
- Check if `microsoft-graph-mcp` is taken: `npm view microsoft-graph-mcp`
- If taken, update package name in `package.json` and repository

### Issue: Authentication errors
- Verify your npm token has "Automation" or "Publish" permissions
- Ensure token hasn't expired
- Check that you're logged in to the correct npm account

## Release Types That Trigger Publishing

| Commit Type | Release Type | Example |
|------------|--------------|---------|
| `fix:` | Patch (0.0.1 → 0.0.2) | `fix: Fix bug` |
| `perf:` | Patch (0.0.1 → 0.0.2) | `perf: Improve performance` |
| `refactor:` | Patch (0.0.1 → 0.0.2) | `refactor: Clean up code` |
| `feat:` | ❌ No release | `feat: Add feature` |
| `docs:`, `chore:`, `test:`, `ci:` | ❌ No release | `docs: Update README` |

## Verify Publication

After a release, verify it's on npm:

```bash
npm view microsoft-graph-mcp versions
npm view microsoft-graph-mcp version
```

