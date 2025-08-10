import { Agent as BskyAgent, CredentialSession } from "@atproto/api";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// no additional types needed here
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createTools, type ToolDefinition } from "./tools.ts";

export interface BlueskyCredentials {
	identifier: string;
	appKey: string;
	serviceUrl?: string;
}

export interface LocalSetupServerOptions {
	server: McpServer;
	credentials: BlueskyCredentials;
	mode: "local";
}

export interface RemoteSetupServerOptions {
	server: McpServer;
	getAgent: () => BskyAgent;
	userIdentifier: string;
	mode: "remote";
}

export type SetupServerOptions =
	| LocalSetupServerOptions
	| RemoteSetupServerOptions;

export async function setupServer(opts: SetupServerOptions): Promise<void> {
	if (opts.mode === "local") {
		await setupLocalServer(opts.server, opts.credentials);
	} else {
		setupRemoteServer(opts.server, opts.getAgent, opts.userIdentifier);
	}
}

/**
 * Perform local server setup: login, register tools, and connect transport.
 */
async function setupLocalServer(
	server: McpServer,
	credentials: BlueskyCredentials,
): Promise<void> {
	const {
		identifier,
		appKey,
		serviceUrl = "https://bsky.social",
	} = credentials;
	const session = new CredentialSession(new URL(serviceUrl));
	const login = await session.login({ identifier, password: appKey });
	if (!login.success) throw new Error("Bluesky login failed");

	const agent = new BskyAgent(session);
	const agentGetter = () => agent;
	registerBlueskyTools(server, agentGetter, identifier);

	const transport = new StdioServerTransport();
	await server.connect(transport);
}

/**
 * Perform remote server setup: register tools using provided agent.
 */
function setupRemoteServer(
	server: McpServer,
	getAgent: () => BskyAgent,
	userIdentifier: string,
): void {
	registerBlueskyTools(server, getAgent, userIdentifier);
}

export function registerBlueskyTools(
	server: McpServer,
	getAgent: () => BskyAgent,
	userIdentifier: string,
): void {
	const tools: ToolDefinition[] = createTools(getAgent, userIdentifier);
	for (const tool of tools) {
		if (tool.schema === undefined) {
			server.tool(tool.name, tool.description, (extra) => tool.callback(extra));
		} else {
			server.tool(tool.name, tool.description, tool.schema, (args, extra) =>
				tool.callback(args, extra),
			);
		}
	}
}
