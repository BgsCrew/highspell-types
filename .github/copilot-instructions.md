# HighSpell SDK Monorepo - AI Agent Instructions

## Project Overview
This is a TypeScript SDK monorepo that generates type definitions for the HighSpell game client by reverse-engineering its minified JavaScript code. The SDK enables developers to write plugins using a clean, typed API that gets transpiled to game-compatible code.

## Essential Commands (Always use pnpm)
```bash
# Install all workspace dependencies
pnpm install

# Build all packages (types generation + babel plugin)
pnpm -r build

# Build specific packages
pnpm --filter @bgscrew/highspell-types build
pnpm --filter @bgscrew/highspell-build-plugin build

# Run tests across workspace
pnpm test

# Lint and format across workspace
pnpm check
```

## Architecture & Key Patterns

### Monorepo Structure
- `packages/types/` - Auto-generates TypeScript definitions from live game client
- `packages/build-plugin/` - Babel plugin that transpiles friendly names to minified names

### Type Generation Workflow
1. **Source**: Downloads `https://highspell.com/js/client/client.51.js`
2. **Parse**: Uses Babel AST to identify manager singletons, enums, classes
3. **Map**: Converts minified names (`pW`) to friendly names (`GameLoop`) via `nameMappings` in `generate-types.js`
4. **Generate**: Creates TypeScript definitions in `packages/types/src/generated.d.ts`

### Build-time Transformation
- Developer code uses friendly names: `Core.GameLoop.Instance`
- Babel plugin transforms to: `game.Managers.pW.Instance`
- Mapping defined in `babel-plugin-highspell.js` using `friendlyToMinified`

### Critical Files
- `packages/types/scripts/generate-types.js` - Core type generation logic (1000+ lines)
- `packages/types/src/generated.d.ts` - Auto-generated, never edit manually
- `packages/build-plugin/src/babel-plugin-highspell.js` - Name transformation logic
- `packages/types/src/index.d.ts` - Developer-facing API exports

## Development Patterns

### Manager Singleton Pattern
All game functionality exposed through managers with `.Instance` getter:
```typescript
// Friendly API (developer writes)
Core.GameLoop.Instance.start()

// Transpiled output (what game sees)
game.Managers.pW.Instance.start()
```

### Bidirectional Name Mapping
- `nameMappings` object in `generate-types.js` maps minified → friendly
- `friendlyToMinified` in babel plugin maps friendly → minified
- Keep both in sync when adding new managers

### Testing Strategy
- Jest unit tests in `__tests__/` directories
- Snapshot tests ensure type generation consistency
- No integration tests - focuses on transformation correctness

## CI/CD Pipeline
- **Pipeline**: Triggers on push/PR to main, scheduled daily
- **CI**: Lint, type-check, test, build (creates artifacts)
- **CodeQL**: Security analysis
- **CD**: Publishes to GitHub Package Registry with auto-versioning

### Workflow Commands
```bash
# Generate types with local client (dev)
pnpm --filter @bgscrew/highspell-types build

# Generate types from live client (CI)
pnpm --filter @bgscrew/highspell-types build:ci
```

## Important Constraints
- **Never edit `generated.d.ts`** - it's auto-generated from live game code
- **Always use pnpm** - this is a pnpm workspace with specific lock files
- **Network dependency** - Type generation fetches live game client
- **Minified mapping fragility** - Game updates can break name mappings
- **GitHub Package Registry** - Publishes to `@bgscrew` scope on GitHub, not npmjs

## Adding New Managers
1. Add minified → friendly mapping in `generate-types.js` `nameMappings`
2. Update babel plugin's `friendlyToMinified` mapping
3. Run `pnpm --filter @bgscrew/highspell-types build` to regenerate types
4. Test transformation with babel plugin
