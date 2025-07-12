# HighSpell SDK Monorepo

This monorepo contains the tools and libraries for developing plugins and extensions for the HighSpell game client.

## Packages

-   `packages/types`: A package that automatically generates TypeScript definitions from the game's minified source code. This is the foundation of the SDK.
-   `packages/build-plugin`: A Babel plugin that transpiles code written with the friendly `@bgscrew/highspell-types` into the minified, obfuscated code that the game client understands.

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
    pnpm -r build
    ```

## Contributing

Contributions are welcome! Please open an issue or pull request to discuss any changes.