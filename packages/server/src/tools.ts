import type { Agent } from "@atproto/api";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

const getProfileToolDef: Tool = {
	name: "bluesky_get_profile",
	description: "Get a user's profile information",
	inputSchema: {
		type: "object",
		properties: {},
	},
};

const getPostsToolDef: Tool = {
	name: "bluesky_get_posts",
	description: "Get recent posts from a user",
	inputSchema: {
		type: "object",
		properties: {
			limit: {
				type: "number",
				description: "Maximum number of posts to return (default 50, max 100)",
				default: 50,
			},
			cursor: {
				type: "string",
				description: "Pagination cursor for next page of results",
			},
		},
	},
};

const searchPostsToolDef: Tool = {
	name: "bluesky_search_posts",
	description: "Search for posts on Bluesky",
	inputSchema: {
		type: "object",
		properties: {
			query: {
				type: "string",
				description: "The search query",
			},
			limit: {
				type: "number",
				description: "Maximum number of posts to return (default 25, max 100)",
				default: 25,
			},
			cursor: {
				type: "string",
				description: "Pagination cursor for next page of results",
			},
		},
		required: ["query"],
	},
};

const getFollowsToolDef: Tool = {
	name: "bluesky_get_follows",
	description: "Get a list of accounts the user follows",
	inputSchema: {
		type: "object",
		properties: {
			limit: {
				type: "number",
				description:
					"Maximum number of follows to return (default 50, max 100)",
				default: 50,
			},
			cursor: {
				type: "string",
				description: "Pagination cursor for next page of results",
			},
		},
	},
};

const getFollowersToolDef: Tool = {
	name: "bluesky_get_followers",
	description: "Get a list of accounts following the user",
	inputSchema: {
		type: "object",
		properties: {
			limit: {
				type: "number",
				description:
					"Maximum number of followers to return (default 50, max 100)",
				default: 50,
			},
			cursor: {
				type: "string",
				description: "Pagination cursor for next page of results",
			},
		},
	},
};

const getLikedPostsToolDef: Tool = {
	name: "bluesky_get_liked_posts",
	description: "Get a list of posts liked by the user",
	inputSchema: {
		type: "object",
		properties: {
			limit: {
				type: "number",
				description:
					"Maximum number of liked posts to return (default 50, max 100)",
				default: 50,
			},
			cursor: {
				type: "string",
				description: "Pagination cursor for next page of results",
			},
		},
	},
};

const getPersonalFeedToolDef: Tool = {
	name: "bluesky_get_personal_feed",
	description: "Get your personalized Bluesky feed",
	inputSchema: {
		type: "object",
		properties: {
			limit: {
				type: "number",
				description:
					"Maximum number of feed items to return (default 50, max 100)",
				default: 50,
			},
			cursor: {
				type: "string",
				description: "Pagination cursor for next page of results",
			},
		},
	},
};

const searchProfilesToolDef: Tool = {
	name: "bluesky_search_profiles",
	description: "Search for Bluesky profiles",
	inputSchema: {
		type: "object",
		properties: {
			query: {
				type: "string",
				description: "Search query string",
			},
			limit: {
				type: "number",
				description:
					"Maximum number of results to return (default 25, max 100)",
				default: 25,
			},
			cursor: {
				type: "string",
				description: "Pagination cursor for next page of results",
			},
		},
		required: ["query"],
	},
};

const searchStarterPacksToolDef: Tool = {
	name: "bluesky_search_starter_packs",
	description: "Search for Bluesky starter packs",
	inputSchema: {
		type: "object",
		properties: {
			query: {
				type: "string",
				description: "Search query string",
			},
			limit: {
				type: "number",
				description:
					"Maximum number of results to return (default 25, max 100)",
				default: 25,
			},
			cursor: {
				type: "string",
				description: "Pagination cursor for next page of results",
			},
		},
		required: ["query"],
	},
};

export const toolDefinitions = {
	getProfileToolDef,
	getPostsToolDef,
	searchPostsToolDef,
	getFollowsToolDef,
	getFollowersToolDef,
	getLikedPostsToolDef,
	getPersonalFeedToolDef,
	searchProfilesToolDef,
	searchStarterPacksToolDef,
};

export async function getProfile(agent: Agent, blueskyIdentifier: string) {
	const response = await agent.getProfile({
		actor: blueskyIdentifier,
	});
	return { content: [{ type: "text", text: JSON.stringify(response) }] };
}

export async function getPosts(
	agent: Agent,
	blueskyIdentifier: string,
	args: Record<string, unknown>
) {
	const { limit, cursor } = args;
	const response = await agent.getAuthorFeed({
		actor: blueskyIdentifier,
		limit: limit as number | undefined,
		cursor: cursor as string | undefined,
	});
	return { content: [{ type: "text", text: JSON.stringify(response) }] };
}

export async function searchPosts(agent: Agent, args: Record<string, unknown>) {
	const { query, limit, cursor } = args;
	if (!query) {
		throw new Error("Missing required argument: query");
	}
	const response = await agent.app.bsky.feed.searchPosts({
		q: query as string,
		limit: limit as number | undefined,
		cursor: cursor as string | undefined,
	});
	return { content: [{ type: "text", text: JSON.stringify(response) }] };
}

export async function getFollows(
	agent: Agent,
	blueskyIdentifier: string,
	args: Record<string, unknown>
) {
	const { limit, cursor } = args;
	const response = await agent.getFollows({
		actor: blueskyIdentifier,
		limit: limit as number | undefined,
		cursor: cursor as string | undefined,
	});
	return { content: [{ type: "text", text: JSON.stringify(response) }] };
}

export async function getFollowers(
	agent: Agent,
	blueskyIdentifier: string,
	args: Record<string, unknown>
) {
	const { limit, cursor } = args;
	const response = await agent.getFollowers({
		actor: blueskyIdentifier,
		limit: limit as number | undefined,
		cursor: cursor as string | undefined,
	});
	return { content: [{ type: "text", text: JSON.stringify(response) }] };
}

export async function getLikedPosts(
	agent: Agent,
	blueskyIdentifier: string,
	args: Record<string, unknown>
) {
	const { limit, cursor } = args;
	const response = await agent.getActorLikes({
		actor: blueskyIdentifier,
		limit: limit as number | undefined,
		cursor: cursor as string | undefined,
	});
	return { content: [{ type: "text", text: JSON.stringify(response) }] };
}

export async function getPersonalFeed(
	agent: Agent,
	args: Record<string, unknown>
) {
	const { limit, cursor } = args;
	const response = await agent.getTimeline({
		limit: limit as number | undefined,
		cursor: cursor as string | undefined,
	});
	return { content: [{ type: "text", text: JSON.stringify(response) }] };
}

export async function searchProfiles(
	agent: Agent,
	args: Record<string, unknown>
) {
	const { query, limit, cursor } = args;
	if (!query) {
		throw new Error("Missing required argument: query");
	}
	const response = await agent.api.app.bsky.actor.searchActors({
		q: query as string,
		limit: limit as number | undefined,
		cursor: cursor as string | undefined,
	});
	return { content: [{ type: "text", text: JSON.stringify(response.data) }] };
}
