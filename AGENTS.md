# Agent Guidelines

## Build/Test Commands
- **Install**: `bun install` (enforced via preinstall hook)
- **Server build**: `cd packages/server && bun run build`
- **Server start (Bun)**: `cd packages/server && bun start`
- **Server start (Node.js)**: `cd packages/server && bun run start:node`

## Runtime Support
- **Node.js**: Requires v22.6.0+ with `--experimental-strip-types` flag (automatically handled)
- **Bun**: Full TypeScript support out of the box
- **Entry point**: `packages/server/bin/index.ts` works with both runtimes

## Code Style
- **Formatter**: Biome with tabs (width 2), 80 char line width, double quotes, trailing commas
- **Linting**: Biome with recommended rules, `noConsoleLog` as error
- **Imports**: Use `.js` extensions for local imports, organize imports enabled
- **Types**: TypeScript with explicit types, prefer interfaces over types
- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces
- **Error handling**: Prefer returning errors over throwing, use proper error types
- **Comments**: Use FIXME: for temporary/fake data that needs attention

## Project Structure
- Monorepo with `packages/server` (MCP server)
- Use workspace dependencies with `workspace:*` syntax
- Export types and functions explicitly from index files
