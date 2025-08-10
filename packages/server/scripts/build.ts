#!/usr/bin/env bun

import { $ } from "bun";
import pkg from "../package.json";

interface PackageJson {
	dependencies?: Record<string, string>;
}
const dependencies: Record<string, string> =
	(pkg as PackageJson).dependencies ?? {};
const externalDependencies: string[] = Object.keys(dependencies);

await $`rm -rf dist`;

await Bun.build({
	format: "esm",
	outdir: "dist",
	packages: "external",
	root: "src",
	entrypoints: ["src/index.ts"],
	external: externalDependencies,
});

await $`tsc --outDir dist/types --declaration --emitDeclarationOnly --declarationMap`;
