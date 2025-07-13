# HighSpell SDK Monorepo

This monorepo contains the tools and libraries for developing plugins and extensions for the HighSpell game client.

## Packages

### Core Libraries

-   `packages/types`: Automatically generates TypeScript definitions from the game's minified source code. This is the foundation of the SDK.
-   `packages/build-core`: Shared transformation logic used by all build plugins. Provides the core functionality for transforming friendly names to minified names.

### Build Tool Plugins

-   `packages/babel-build-plugin`: Babel plugin that transpiles code written with friendly `@bgscrew/highspell-types` names into minified game-ready code.
-   `packages/swc-build-plugin`: SWC plugin for high-performance transformations in Rust-based build tools.
-   `packages/vite-build-plugin`: Vite plugin for seamless integration with Vite-based projects.

## Vision

The goal of this project is to provide a seamless developer experience for creating HighSpell plugins. Developers should be able to write code using a modern, fully-typed API, and have it automatically transpiled into a game-ready format at build time.

## Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Build all packages:
    ```bash
    pnpm build:all
    ```

## Usage

### With Babel

```javascript
// babel.config.js
module.exports = {
  plugins: ['@bgscrew/highspell-babel-build-plugin']
};
```

### With Vite

```javascript
// vite.config.js
import highspellPlugin from '@bgscrew/highspell-vite-build-plugin';

export default {
  plugins: [highspellPlugin()]
};
```

### With SWC

```json
// .swcrc
{
  "jsc": {
    "experimental": {
      "plugins": [["@bgscrew/highspell-swc-build-plugin", {}]]
    }
  }
}
```

## Development

### Building

- Build types first: `pnpm build:types`
- Build all packages: `pnpm build:all`
- Run all tests: `pnpm test:all`

### Architecture

All build plugins share a common core library (`@bgscrew/highspell-build-core`) that provides:
- Pattern matching for `Core.ManagerName` and `Generated.Managers.ManagerName`
- Name mapping from friendly to minified names
- Import removal for `@bgscrew/highspell-types`

This DRY approach ensures consistency across all build tool integrations.

## Contributing

Contributions are welcome! Please open an issue or pull request to discuss any changes.