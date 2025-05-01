//evals.ts

import { EvalConfig } from 'mcp-evals';
import { openai } from "@ai-sdk/openai";
import { grade, EvalFunction } from "mcp-evals";

const bluesky_get_profileEval: EvalFunction = {
    name: "bluesky_get_profileEval",
    description: "Evaluates the accuracy and completeness of retrieving a user's profile information",
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please use the bluesky_get_profile tool to retrieve the profile of '@example.bsky.social', including display name, bio, and follower count.");
        return JSON.parse(result);
    }
};

const bluesky_get_postsEval: EvalFunction = {
    name: "Bluesky Get Posts Tool Evaluation",
    description: "Evaluates the retrieval of recent posts from a user using the bluesky_get_posts tool",
    run: async () => {
        const result = await grade(openai("gpt-4"), "Retrieve the 5 most recent posts from user @exampleuser using the bluesky_get_posts tool with a limit of 5.");
        return JSON.parse(result);
    }
};

const bluesky_search_postsEval: EvalFunction = {
    name: 'bluesky_search_posts Evaluation',
    description: 'Evaluates the functionality of searching posts on Bluesky',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Search for posts on Bluesky about AI, with a limit of 5 results.");
        return JSON.parse(result);
    }
};

const bluesky_get_followsEval: EvalFunction = {
    name: "bluesky_get_follows Tool Evaluation",
    description: "Evaluates retrieval of accounts the user follows",
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please use bluesky_get_follows to list the first 10 accounts the user follows.");
        return JSON.parse(result);
    }
};

const bluesky_get_followersEval: EvalFunction = {
    name: "Bluesky Get Followers Tool Evaluation",
    description: "Evaluates the functionality of the Bluesky get followers tool",
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please retrieve the list of followers for the current user with a limit of 20.");
        return JSON.parse(result);
    }
};

const config: EvalConfig = {
    model: openai("gpt-4"),
    evals: [bluesky_get_profileEval, bluesky_get_postsEval, bluesky_search_postsEval, bluesky_get_followsEval, bluesky_get_followersEval]
};
  
export default config;
  
export const evals = [bluesky_get_profileEval, bluesky_get_postsEval, bluesky_search_postsEval, bluesky_get_followsEval, bluesky_get_followersEval];