# HighSpell Build Core

Core transformation library for HighSpell build plugins. This package provides shared functionality for transforming friendly manager names to minified names across different build tools.

## Installation

```bash
pnpm add @bgscrew/highspell-build-core
```

## Usage

This package is primarily used by other build plugins, but can also be used directly:

```javascript
const {
  isCoreManagerAccess,
  isGeneratedManagerAccess,
  shouldRemoveImport,
  transformHighSpellNode,
  getTransformationInfo,
} = require('@bgscrew/highspell-build-core');

// Check if a node matches Core.ManagerName pattern
const coreMatch = isCoreManagerAccess(node);

// Check if a node matches Generated.Managers.ManagerName pattern
const generatedMatch = isGeneratedManagerAccess(node);

// Check if an import should be removed
const shouldRemove = shouldRemoveImport('@bgscrew/highspell-types');

// Get transformation info
const info = getTransformationInfo();
console.log(info.availableManagers);
```

## API

### Functions

- `isCoreManagerAccess(node)` - Checks if a node represents a Core.ManagerName pattern
- `isGeneratedManagerAccess(node)` - Checks if a node represents a Generated.Managers.ManagerName pattern
- `shouldRemoveImport(source)` - Checks if an import should be removed
- `createGameManagerAccess(createIdentifier, createMemberExpression, minifiedName, addInstance)` - Creates Game.minifiedName[.Instance] structure
- `transformHighSpellNode(node, createIdentifier, createMemberExpression)` - Generic transformation function
- `getTransformationInfo()` - Returns transformation information

### Constants

- `TRANSFORM_PATTERNS` - Object containing pattern strings for different transformations

## Transformations

The core library handles these transformations:

- `Core.GameLoop` → `Game.pW.Instance`
- `Core.GameLoop.method()` → `Game.pW.method()`
- `Generated.Managers.GameLoop.Instance` → `Game.pW.Instance`
- Removes imports of `@bgscrew/highspell-types`

## Example

See the `example/` directory for a complete working example:

- `example/usage.js` - Demonstrates core transformation functions
- `example/package.json` - Run script

To run the example:

```bash
cd example
node usage.js
```

This will demonstrate the core transformation functions and their output.

## Contributing

This package is part of the HighSpell SDK monorepo. See the main README for contribution guidelines.
