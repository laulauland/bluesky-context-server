import { Agent, CredentialSession } from "@atproto/api";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  type CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";

const getProfileTool: Tool = {
  name: "bluesky_get_profile",
  description: "Get a user's profile information",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

const getPostsTool: Tool = {
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

const searchPostsTool: Tool = {
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

const getFollowsTool: Tool = {
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

const getFollowersTool: Tool = {
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

const getLikedPostsTool: Tool = {
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

const getPersonalFeedTool: Tool = {
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

const searchProfilesTool: Tool = {
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

async function main() {
  // Hard-code Bluesky credentials here
  const blueskyToken = process.env.BLUESKY_APP_KEY;
  const blueskyIdentifier = process.env.BLUESKY_IDENTIFIER;

  if (!blueskyToken || !blueskyIdentifier) {
    console.error("BLUESKY_APP_KEY and BLUESKY_IDENTIFIER must be set");
    process.exit(1);
  }

  console.log("Starting Bluesky MCP Server...");
  const server = new Server(
    {
      name: "Bluesky MCP Server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

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
      ],
    };
  });

  const transport = new StdioServerTransport();
  console.log("Connecting server to transport...");
  await server.connect(transport);

  console.log("Bluesky MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
