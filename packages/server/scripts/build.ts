#!/usr/bin/env bun

import { $, Glob } from "bun";
import pkg from "../package.json" assert { type: "json" };

await $`rm -rf dist`;

await Bun.build({
	format: "esm",
	outdir: "dist",
	packages: "external",
	root: "src",
	entrypoints: ["src/index.ts"],
	external: [...Object.keys(pkg.dependencies)],
});

await $`tsc --outDir dist/types --declaration --emitDeclarationOnly --declarationMap`;
