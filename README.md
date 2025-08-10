# Bluesky Context Server
[![smithery badge](https://smithery.ai/badge/bluesky-context-server)](https://smithery.ai/server/bluesky-context-server)

A Model Context Protocol (MCP) server that enables MCP clients like Claude Desktop to interact with Bluesky. Query your profile, search posts, get your timeline, and more directly from your AI assistant.

## Prerequisites

- **Runtime**: Either [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/) v22.6.0+
- A Bluesky account

## Setup

### 1. Get Your Bluesky Credentials

You'll need two pieces of information from your Bluesky account:

#### BLUESKY_IDENTIFIER
This is your Bluesky handle (username). It can be in either format:
- `username.bsky.social` (e.g., `alice.bsky.social`)
- `@username.bsky.social` (e.g., `@alice.bsky.social`)

#### BLUESKY_APP_KEY
This is an App Password, which is different from your regular Bluesky password. To create one:

1. Go to [Bluesky Settings](https://bsky.app/settings)
2. Navigate to "Privacy and Security" → "App Passwords"
3. Click "Add App Password"
4. Give it a name (e.g., "MCP Server")
5. Copy the generated password (it looks like `xxxx-xxxx-xxxx-xxxx`)

⚠️ **Important**: Use the App Password, not your regular account password!

### 2. Installation

#### Option A: Installing via Smithery (Recommended)

To install Bluesky Context Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@laulauland/bluesky-context-server):

```bash
npx -y @smithery/cli install @laulauland/bluesky-context-server --client claude
```

Then add your credentials to the generated configuration.

#### Option B: Manual Installation

1. Clone or download this repository
2. Configure your Claude Desktop app to use the MCP server:

**Using Bun:**
```json
// ~/Library/Application Support/Claude/config.json (macOS)
// %APPDATA%/Claude/config.json (Windows)
{
	"mcpServers": {
		"bluesky": {
			"command": "/Users/your-username/.bun/bin/bun",
			"args": [
				"/path/to/bluesky-context-server/packages/server/bin/index.ts"
			],
			"env": {
				"BLUESKY_APP_KEY": "your-app-password-here",
				"BLUESKY_IDENTIFIER": "your-handle.bsky.social"
			}
		}
	}
}
```

**Using Node.js:**
```json
// ~/Library/Application Support/Claude/config.json (macOS)
// %APPDATA%/Claude/config.json (Windows)
{
	"mcpServers": {
		"bluesky": {
			"command": "node",
			"args": [
				"--experimental-strip-types",
				"/path/to/bluesky-context-server/packages/server/bin/index.ts"
			],
			"env": {
				"BLUESKY_APP_KEY": "your-app-password-here",
				"BLUESKY_IDENTIFIER": "your-handle.bsky.social"
			}
		}
	}
}
```

3. Restart Claude Desktop

### 3. Testing the Connection

After setup, you can test the connection by asking Claude something like:
- "Can you get my Bluesky profile?"
- "Show me my recent posts on Bluesky"
- "Search for posts about AI on Bluesky"

## Available MCP Tools

This server provides the following tools that Claude can use:

### Profile & Account Tools

#### `bluesky_get_profile`
Get your Bluesky profile information including display name, bio, follower count, etc.
- **Parameters**: None
- **Returns**: Complete profile data

#### `bluesky_get_follows`
Get a list of accounts you follow.
- **Parameters**: 
  - `limit` (optional): Max items to return (default 50, max 100)
  - `cursor` (optional): Pagination cursor for next page
- **Returns**: List of followed accounts with profile info

#### `bluesky_get_followers`
Get a list of accounts following you.
- **Parameters**: 
  - `limit` (optional): Max items to return (default 50, max 100)
  - `cursor` (optional): Pagination cursor for next page
- **Returns**: List of followers with profile info

### Post & Feed Tools

#### `bluesky_get_posts`
Get your recent posts.
- **Parameters**: 
  - `limit` (optional): Max items to return (default 50, max 100)
  - `cursor` (optional): Pagination cursor for next page
- **Returns**: Your recent posts with engagement data

#### `bluesky_get_personal_feed`
Get your personalized Bluesky timeline/feed.
- **Parameters**: 
  - `limit` (optional): Max items to return (default 50, max 100)
  - `cursor` (optional): Pagination cursor for next page
- **Returns**: Posts from your personalized feed

#### `bluesky_get_liked_posts`
Get posts you've liked.
- **Parameters**: 
  - `limit` (optional): Max items to return (default 50, max 100)
  - `cursor` (optional): Pagination cursor for next page
- **Returns**: Posts you've liked

### Search Tools

#### `bluesky_search_posts`
Search for posts across Bluesky.
- **Parameters**: 
  - `query` (required): Search query string
  - `limit` (optional): Max items to return (default 50, max 100)
  - `cursor` (optional): Pagination cursor for next page
- **Returns**: Posts matching your search query

#### `bluesky_search_profiles`
Search for Bluesky user profiles.
- **Parameters**: 
  - `query` (required): Search query string
  - `limit` (optional): Max items to return (default 50, max 100)
  - `cursor` (optional): Pagination cursor for next page
- **Returns**: User profiles matching your search query

## Example Usage

Once configured, you can ask Claude things like:

- "What's in my Bluesky feed today?"
- "Search for posts about TypeScript on Bluesky"
- "Who are my most recent followers?"
- "Show me posts I've liked recently"
- "Find Bluesky users interested in AI"

## Troubleshooting

### Common Issues

1. **"Authentication failed"**: Double-check your `BLUESKY_APP_KEY` and `BLUESKY_IDENTIFIER`
2. **"Server not responding"**: Ensure Bun is installed and the path to the server is correct
3. **"Permission denied"**: Make sure the server file has execute permissions

### Getting Help

If you encounter issues:
1. Check that your Bluesky credentials are correct
2. Verify Bun is installed: `bun --version`
3. Test the server manually: `cd packages/server && bun start`
4. Check Claude Desktop's logs for error messages
