#!/usr/bin/env bun

import { BlueskyContextServer } from "../src/server.js";

async function main() {
	const blueskyToken = process.env.BLUESKY_APP_KEY;
	const blueskyIdentifier = process.env.BLUESKY_IDENTIFIER;
	const serviceUrl = process.env.BLUESKY_SERVICE_URL;

	if (!blueskyToken || !blueskyIdentifier) {
		console.error("BLUESKY_APP_KEY and BLUESKY_IDENTIFIER must be set");
		process.exit(1);
	}

	const server = new BlueskyContextServer({credentials: {
		identifier: blueskyIdentifier,
		appKey: blueskyToken,
		serviceUrl: serviceUrl,
	}});

	await server.start();
}

main().catch((error) => {
	console.error("Unhandled error:", error);
	process.exit(1);
});
