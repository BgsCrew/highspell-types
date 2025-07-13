# HighSpell SWC Build Plugin

An SWC plugin to transpile HighSpell friendly names to minified names. This enables developers to write clean, readable code that gets transpiled to game-compatible code.

## Installation

```bash
pnpm add @bgscrew/highspell-swc-build-plugin
```

## Usage

### With SWC CLI

Create a `.swcrc` file:

```json
{
  "plugins": [["@bgscrew/highspell-swc-build-plugin", {}]]
}
```

### Programmatic Usage

```javascript
const swc = require('@swc/core');
const highspellPlugin = require('@bgscrew/highspell-swc-build-plugin');

const result = await swc.transform(code, {
  plugin: (m) => highspellPlugin()(m),
});
```

## Transformations

The plugin performs the same transformations as the Babel plugin:

### Core Manager Access

```javascript
// Input
const gameLoop = Core.GameLoop;
Core.GameLoop.start();

// Output
const gameLoop = Game.pW.Instance;
Game.pW.start();
```

### Generated Manager Access

```javascript
// Input
const network = Generated.Managers.NetworkManager.Instance;

// Output
const network = Game.FG.Instance;
```

### Import Removal

```javascript
// Input
import { Core } from '@bgscrew/highspell-types';
const gameLoop = Core.GameLoop;

// Output
const gameLoop = Game.pW.Instance;
```

## Supported Managers

The plugin supports all managers defined in the HighSpell types package:

- `GameLoop` → `pW`
- `GameEngine` → `gW`
- `InputManager` → `fW`
- `EntityManager` → `Lk`
- `NetworkManager` → `FG`
- `PacketFactory` → `yV`
- And many more...

## Requirements

- Node.js 14+
- SWC

## Example

See the `example/` directory for a complete working example:

- `example/input.js` - Source code using friendly names
- `example/.swcrc` - SWC configuration
- `example/package.json` - Build scripts

To run the example:

```bash
cd example
pnpm install
pnpm run build
```

This will transform `input.js` to `output.js` with minified names.

## Contributing

This package is part of the HighSpell SDK monorepo. See the main README for contribution guidelines.
