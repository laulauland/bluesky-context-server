import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { BlueskyContextServer } from "bluesky-context-server";

export class BskyMcp extends McpAgent {
	server: McpServer = new BlueskyContextServer({}).server;
	async init() {}
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		return new Response("Hello World!");
	},
} satisfies ExportedHandler<Env>;
