import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const getProfileTool: Tool = {
	name: "bluesky_get_profile",
	description: "Get a user's profile information",
	inputSchema: {
		type: "object",
		properties: {},
	},
};

export const getPostsTool: Tool = {
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

export const searchPostsTool: Tool = {
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

export const getFollowsTool: Tool = {
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

export const getFollowersTool: Tool = {
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

export const getLikedPostsTool: Tool = {
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

export const getPersonalFeedTool: Tool = {
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

export const searchProfilesTool: Tool = {
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

export const searchStarterPacksTool: Tool = {
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
