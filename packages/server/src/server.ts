import { Agent as BskyAgent, CredentialSession } from "@atproto/api";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	type CallToolRequest,
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
	getFollowers,
	getFollows,
	getLikedPosts,
	getPersonalFeed,
	getPosts,
	getProfile,
	searchPosts,
	searchProfiles,
	toolDefinitions,
} from "./tools.js";
import { tryCatchAsync } from "./utils.js";

export interface BlueskyCredentials {
	identifier: string;
	appKey: string;
	serviceUrl?: string;
}

export interface BlueskyContextServerOptions {
	credentials: BlueskyCredentials;
	mode?: BlueskyContextServerMode;
}

type BlueskyContextServerMode = "local" | "remote";

export class BlueskyContextServer {
	public server: McpServer;
	bskyAgent: BskyAgent | null = null;
	private credentials: BlueskyCredentials;
	mode: BlueskyContextServerMode;

	constructor({ credentials, mode = "local" }: BlueskyContextServerOptions) {
		this.credentials = credentials;
		this.mode = mode;

		this.server = new McpServer({
			name: "Bluesky MCP Server",
			version: "1.0.0",
		});

		// this.server = new Server(
		// 	{
		// 		name: "Bluesky MCP Server",
		// 		version: "1.0.0",
		// 	},
		// 	{
		// 		capabilities: {
		// 			tools: toolDefinitions,
		// 		},
		// 	}
		// );

		this.server.setRequestHandler(ListToolsRequestSchema, async () => {
			return { tools: Object.values(toolDefinitions) };
		});

		this.server.setRequestHandler(
			CallToolRequestSchema,
			async (request: CallToolRequest) => {
				const { data, error } = await tryCatchAsync(
					this.handleRequest(request)
				);

				if (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : String(error),
								}),
							},
						],
					};
				}
				return data;
			}
		);
	}

	private async initBskyAgent() {
		const {
			identifier,
			appKey,
			serviceUrl = "https://bsky.social",
		} = this.credentials;

		const serviceURL = serviceUrl
			? new URL(serviceUrl)
			: new URL("https://bsky.social");
		const session = new CredentialSession(serviceURL);

		const loginResponse = await session.login({
			identifier,
			password: appKey,
		});

		if (!loginResponse.success) {
			throw new Error("Failed to login to Bluesky");
		}

		this.bskyAgent = new BskyAgent(session);
	}

	async start() {
		await this.initBskyAgent();

		if (!this.bskyAgent) {
			throw new Error("Failed to initialize Bluesky agent");
		}

		if (this.mode === "local") {
			const transport = new StdioServerTransport();
			await this.server.connect(transport);
		}

		if (this.mode === "remote") {
			throw new Error("Remote mode not implemented");
		}
	}

	async handleRequest(request: CallToolRequest) {
		const identifier = this.credentials.identifier;

		if (!request.params.arguments) {
			throw new Error("No arguments provided");
		}

		if (!this.bskyAgent) {
			throw new Error("No bluesky agent configured");
		}

		switch (request.params.name) {
			case "bluesky_get_profile":
				return await getProfile(this.bskyAgent, identifier);
			case "bluesky_get_posts":
				return await getPosts(
					this.bskyAgent,
					identifier,
					request.params.arguments
				);
			case "bluesky_search_posts":
				return await searchPosts(this.bskyAgent, request.params.arguments);
			case "bluesky_get_follows":
				return await getFollows(
					this.bskyAgent,
					identifier,
					request.params.arguments
				);
			case "bluesky_get_followers":
				return await getFollowers(
					this.bskyAgent,
					identifier,
					request.params.arguments
				);
			case "bluesky_get_liked_posts":
				return await getLikedPosts(
					this.bskyAgent,
					identifier,
					request.params.arguments
				);
			case "bluesky_get_personal_feed":
				return await getPersonalFeed(this.bskyAgent, request.params.arguments);
			case "bluesky_search_profiles":
				return await searchProfiles(this.bskyAgent, request.params.arguments);
			default:
				throw new Error(`Unknown tool: ${request.params.name}`);
		}
	}
}
