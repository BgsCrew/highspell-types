# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript SDK monorepo that generates type definitions for the HighSpell game client by reverse-engineering its minified JavaScript code. The SDK enables developers to write plugins using a clean, typed API that gets transpiled to game-compatible code.

## Essential Commands

### Development
```bash
# Install dependencies (use pnpm, not npm or yarn)
pnpm install

# Build all packages
pnpm -r build

# Build specific package
pnpm --filter @bgscrew/highspell-types build
pnpm --filter @bgscrew/highspell-build-plugin build

# Run tests
pnpm test

# Lint and format
pnpm lint
pnpm format

# Run all checks (lint, format, type-check)
pnpm check

# Run specific test file
pnpm --filter @bgscrew/highspell-types test -- path/to/test.spec.ts
```

## Architecture

### Monorepo Structure
- `packages/types/` - Auto-generates TypeScript definitions from game source
- `packages/build-plugin/` - Babel plugin to transpile friendly names to minified names

### Type Generation Process
1. Downloads game client from `https://highspell.com/js/client/client.51.js`
2. Parses JavaScript AST to identify patterns (singleton managers, enums, classes)
3. Maps minified names (e.g., `pW`) to friendly names (e.g., `GameLoop`)
4. Generates TypeScript definitions in `packages/types/dist/`

### Key Architectural Patterns
- **Manager Singletons**: Game functionality exposed through managers with `.Instance` getter
- **Name Mapping**: Bidirectional mapping between minified and friendly names
- **Build-time Transformation**: Developer code with friendly names transpiles to minified names

### Code Generation Flow
```
Game Source → AST Parser → Name Mapper → Type Generator → TypeScript Definitions
                                ↓
Developer Code → Babel Plugin → Minified Code (game-compatible)
```

## Important Notes

- Always use `pnpm` (not npm/yarn) - this is a pnpm workspace
- Type generation pulls live game code - be mindful of network requests
- The `generated.d.ts` is auto-generated - don't edit manually
- Minified name mappings may change with game updates
- Test snapshots track type generation consistency

## Testing Approach

- Jest for unit tests
- Snapshot tests for generated types consistency
- Tests in `__tests__/` directories
- Run specific tests with `pnpm --filter [package-name] test -- [test-file]`