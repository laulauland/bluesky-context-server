# Bluesky Context Server

A simple MCP server that can enable MCP clients to query Bluesky instances.

## Usage

1. Place the code somewhere on your computer.
2. Configure your Claude Desktop app to use the MCP server.

```json
// ~/Library/Application Support/Claude/config.json
{
	"mcpServers": {
		"bluesky": {
			"command": "/Users/laurynas-fp/.bun/bin/bun",
			"args": [
				"<path_to_this_directory>/bluesky-context-server/index.ts"
			],
			"env": {
				"BLUESKY_APP_KEY": "",
				"BLUESKY_IDENTIFIER": ""
			}
		}
	}
}
```

