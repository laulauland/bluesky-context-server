import { main } from "./main.js";

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
