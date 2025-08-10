#!/usr/bin/env node --experimental-strip-types

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { setupServer } from "../src/server.ts";

async function main() {
	const blueskyToken = process.env.BLUESKY_APP_KEY;
	const blueskyIdentifier = process.env.BLUESKY_IDENTIFIER;
	const serviceUrl = process.env.BLUESKY_SERVICE_URL;

	if (!blueskyToken || !blueskyIdentifier) {
		console.error("BLUESKY_APP_KEY and BLUESKY_IDENTIFIER must be set");
		process.exit(1);
	}

	const server = new McpServer({
		name: "Bluesky MCP Server",
		version: "1.0.0",
	});

	await setupServer({
		server,
		credentials: {
			appKey: blueskyToken,
			identifier: blueskyIdentifier,
			...(serviceUrl && { serviceUrl }),
		},
		mode: "local",
	});
}

main().catch((error) => {
	console.error("Unhandled error:", error);
	process.exit(1);
});
