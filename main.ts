import { Agent, CredentialSession } from "@atproto/api";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	type CallToolRequest,
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
	getFollowersTool,
	getFollowsTool,
	getLikedPostsTool,
	getPersonalFeedTool,
	getPostsTool,
	getProfileTool,
	searchPostsTool,
	searchProfilesTool,
	searchStarterPacksTool,
} from "./tools.js";

export async function main() {
	const blueskyToken = process.env.BLUESKY_APP_KEY;
	const blueskyIdentifier = process.env.BLUESKY_IDENTIFIER;

	if (!blueskyToken || !blueskyIdentifier) {
		console.error("BLUESKY_APP_KEY and BLUESKY_IDENTIFIER must be set");
		process.exit(1);
	}

	const server = new Server(
		{
			name: "Bluesky MCP Server",
			version: "1.0.0",
		},
		{
			capabilities: {
				tools: {
					getProfileTool,
					getPostsTool,
					searchPostsTool,
					getFollowsTool,
					getFollowersTool,
					getLikedPostsTool,
					getPersonalFeedTool,
					searchProfilesTool,
					searchStarterPacksTool,
				},
			},
		},
	);

	server.sendLoggingMessage({
		level: "debug",
		data: "Starting Bluesky Context server",
	});

	const session = new CredentialSession(new URL("https://bsky.social"));

	const loginResponse = await session.login({
		identifier: blueskyIdentifier,
		password: blueskyToken,
	});

	if (!loginResponse.success) {
		console.error("Failed to login");
		process.exit(1);
	}

	const agent = new Agent(session);

	server.setRequestHandler(
		CallToolRequestSchema,
		async (request: CallToolRequest) => {
			console.log("Received CallToolRequest:", request);
			try {
				if (!request.params.arguments) {
					throw new Error("No arguments provided");
				}

				switch (request.params.name) {
					case "bluesky_get_profile": {
						const response = await agent.getProfile({
							actor: blueskyIdentifier,
						});
						return {
							content: [{ type: "text", text: JSON.stringify(response) }],
						};
					}

					case "bluesky_get_posts": {
						const { limit, cursor } = request.params.arguments;
						const response = await agent.getAuthorFeed({
							actor: blueskyIdentifier,
							limit: limit as number | undefined,
							cursor: cursor as string | undefined,
						});
						return {
							content: [{ type: "text", text: JSON.stringify(response) }],
						};
					}

					case "bluesky_search_posts": {
						const { query, limit, cursor } = request.params.arguments;
						if (!query) {
							throw new Error("Missing required argument: query");
						}
						const response = await agent.app.bsky.feed.searchPosts({
							q: query as string,
							limit: limit as number | undefined,
							cursor: cursor as string | undefined,
						});
						return {
							content: [{ type: "text", text: JSON.stringify(response) }],
						};
					}

					case "bluesky_get_follows": {
						const { limit, cursor } = request.params.arguments;
						const response = await agent.getFollows({
							actor: blueskyIdentifier,
							limit: limit as number | undefined,
							cursor: cursor as string | undefined,
						});
						return {
							content: [{ type: "text", text: JSON.stringify(response) }],
						};
					}

					case "bluesky_get_followers": {
						const { limit, cursor } = request.params.arguments;
						const response = await agent.getFollowers({
							actor: blueskyIdentifier,
							limit: limit as number | undefined,
							cursor: cursor as string | undefined,
						});
						return {
							content: [{ type: "text", text: JSON.stringify(response) }],
						};
					}

					case "bluesky_get_liked_posts": {
						const { limit, cursor } = request.params.arguments;
						const response = await agent.getActorLikes({
							actor: blueskyIdentifier,
							limit: limit as number | undefined,
							cursor: cursor as string | undefined,
						});
						return {
							content: [{ type: "text", text: JSON.stringify(response) }],
						};
					}

					case "bluesky_get_personal_feed": {
						const { limit, cursor } = request.params.arguments;
						const response = await agent.getTimeline({
							limit: limit as number | undefined,
							cursor: cursor as string | undefined,
						});
						return {
							content: [{ type: "text", text: JSON.stringify(response) }],
						};
					}

					case "bluesky_search_profiles": {
						const { query, limit, cursor } = request.params.arguments;
						if (!query) {
							throw new Error("Missing required argument: query");
						}
						const response = await agent.api.app.bsky.actor.searchActors({
							q: query as string,
							limit: limit as number | undefined,
							cursor: cursor as string | undefined,
						});
						return {
							content: [{ type: "text", text: JSON.stringify(response.data) }],
						};
					}

					default:
						throw new Error(`Unknown tool: ${request.params.name}`);
				}
			} catch (error) {
				console.error("Error executing tool:", error);
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
		},
	);

	server.setRequestHandler(ListToolsRequestSchema, async () => {
		console.log("Received ListToolsRequest");
		return {
			tools: [
				getProfileTool,
				getPostsTool,
				searchPostsTool,
				getFollowsTool,
				getFollowersTool,
				getLikedPostsTool,
				getPersonalFeedTool,
				searchProfilesTool,
				searchStarterPacksTool,
			],
		};
	});

	const transport = new StdioServerTransport();
	console.log("Connecting server to transport...");
	await server.connect(transport);

	console.log("Bluesky MCP Server running on stdio");
}
