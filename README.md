# Bluesky Context Server
[![smithery badge](https://smithery.ai/badge/bluesky-context-server)](https://smithery.ai/server/bluesky-context-server)

A simple MCP server that can enable MCP clients to query Bluesky instances.

## Usage

### Installing via Smithery

To install Bluesky Context Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@laulauland/bluesky-context-server):

```bash
npx -y @smithery/cli install @laulauland/bluesky-context-server --client claude
```

### Installing manually
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


## Running evals

The evals package loads an mcp client that then runs the index.ts file, so there is no need to rebuild between tests. You can load environment variables by prefixing the npx command. Full documentation can be found [here](https://www.mcpevals.io/docs).

```bash
OPENAI_API_KEY=your-key  npx mcp-eval evals.ts tools.ts
```