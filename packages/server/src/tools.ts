import type { Agent as BskyAgent } from "@atproto/api";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type {
	ServerNotification,
	ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";
import { type ZodRawShape, z } from "zod";
import { tryCatchAsync } from "./utils.ts";

// Define Zod schemas for tool parameters (shapes only)
const PagingSchema: ZodRawShape = {
	limit: z
		.number()
		.describe("Maximum number of items to return (default 50, max 100)")
		.default(50)
		.optional(),
	cursor: z
		.string()
		.describe("Pagination cursor for next page of results")
		.optional(),
};

const SearchSchema: ZodRawShape = {
	query: z.string().describe("Search query string"),
};

const SearchAndPagingSchema: ZodRawShape = {
	...SearchSchema,
	...PagingSchema,
};

// Define types based on schemas for better type safety
type PagingParams = {
	limit?: number;
	cursor?: string;
};

type SearchParams = {
	query: string;
};

type SearchAndPagingParams = SearchParams & PagingParams;

// Standard response formatter
const formatResponse = (data: unknown) => ({
	content: [{ type: "text" as const, text: JSON.stringify(data) }],
});

const formatError = (error: Error) => ({
	content: [{ type: "text" as const, text: `Error: ${error.message}` }],
	isError: true,
});

// Helper types for tool definitions
type ToolResponse = {
	content: { type: "text"; text: string }[];
	isError?: boolean;
};

type ToolCallbackWithSchema = (
	args: Record<string, unknown>,
	extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => Promise<ToolResponse>;

type ToolCallbackWithoutSchema = (
	extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => Promise<ToolResponse>;

export type ToolDefinitionWithSchema = {
	name: string;
	description: string;
	schema: ZodRawShape;
	callback: ToolCallbackWithSchema;
};

export type ToolDefinitionWithoutSchema = {
	name: string;
	description: string;
	schema?: undefined;
	callback: ToolCallbackWithoutSchema;
};

export type ToolDefinition =
	| ToolDefinitionWithSchema
	| ToolDefinitionWithoutSchema;

// Create all tool definitions for registration
export function createTools(
	getAgent: () => BskyAgent,
	userIdentifier: string,
): ToolDefinition[] {
	const agent = getAgent();
	return [
		{
			name: "bluesky_get_profile",
			description: "Get a user's profile information",
			callback: async (
				_extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
			) => {
				const { data, error } = await tryCatchAsync(
					agent.getProfile({ actor: userIdentifier }),
				);

				if (error) {
					return formatError(error);
				}

				return formatResponse(data);
			},
		},
		{
			name: "bluesky_get_posts",
			description: "Get recent posts from a user",
			schema: PagingSchema,
			callback: async (
				args: Record<string, unknown>,
				_extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
			) => {
				const { limit, cursor } = args as PagingParams;

				const { data, error } = await tryCatchAsync(
					agent.getAuthorFeed({
						actor: userIdentifier,
						limit,
						cursor,
					}),
				);

				if (error) {
					return formatError(error);
				}

				return formatResponse(data);
			},
		},
		{
			name: "bluesky_search_posts",
			description: "Search for posts on Bluesky",
			schema: SearchAndPagingSchema,
			callback: async (
				args: Record<string, unknown>,
				_extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
			) => {
				const { query, limit, cursor } = args as SearchAndPagingParams;

				if (!query) {
					return formatError(new Error("Missing required argument: query"));
				}

				const { data, error } = await tryCatchAsync(
					agent.app.bsky.feed.searchPosts({
						q: query,
						limit,
						cursor,
					}),
				);

				if (error) {
					return formatError(error);
				}

				return formatResponse(data);
			},
		},
		{
			name: "bluesky_get_follows",
			description: "Get a list of accounts the user follows",
			schema: PagingSchema,
			callback: async (
				args: Record<string, unknown>,
				_extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
			) => {
				const { limit, cursor } = args as PagingParams;

				const { data, error } = await tryCatchAsync(
					agent.getFollows({
						actor: userIdentifier,
						limit,
						cursor,
					}),
				);

				if (error) {
					return formatError(error);
				}

				return formatResponse(data);
			},
		},
		{
			name: "bluesky_get_followers",
			description: "Get a list of accounts following the user",
			schema: PagingSchema,
			callback: async (
				args: Record<string, unknown>,
				_extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
			) => {
				const { limit, cursor } = args as PagingParams;

				const { data, error } = await tryCatchAsync(
					agent.getFollowers({
						actor: userIdentifier,
						limit,
						cursor,
					}),
				);

				if (error) {
					return formatError(error);
				}

				return formatResponse(data);
			},
		},
		{
			name: "bluesky_get_liked_posts",
			description: "Get a list of posts liked by the user",
			schema: PagingSchema,
			callback: async (
				args: Record<string, unknown>,
				_extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
			) => {
				const { limit, cursor } = args as PagingParams;

				const { data, error } = await tryCatchAsync(
					agent.getActorLikes({
						actor: userIdentifier,
						limit,
						cursor,
					}),
				);

				if (error) {
					return formatError(error);
				}

				return formatResponse(data);
			},
		},
		{
			name: "bluesky_get_personal_feed",
			description: "Get your personalized Bluesky feed",
			schema: PagingSchema,
			callback: async (
				args: Record<string, unknown>,
				_extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
			) => {
				const { limit, cursor } = args as PagingParams;

				const { data, error } = await tryCatchAsync(
					agent.getTimeline({
						limit,
						cursor,
					}),
				);

				if (error) {
					return formatError(error);
				}

				return formatResponse(data);
			},
		},
		{
			name: "bluesky_search_profiles",
			description: "Search for Bluesky profiles",
			schema: SearchAndPagingSchema,
			callback: async (
				args: Record<string, unknown>,
				_extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
			) => {
				const { query, limit, cursor } = args as SearchAndPagingParams;

				if (!query) {
					return formatError(new Error("Missing required argument: query"));
				}

				const { data, error } = await tryCatchAsync(
					agent.api.app.bsky.actor.searchActors({
						q: query,
						limit,
						cursor,
					}),
				);

				if (error) {
					return formatError(error);
				}

				return formatResponse(data.data);
			},
		},
	];
}

// Define tool names as a type
export type ToolName = ReturnType<typeof createTools>[number]["name"];
