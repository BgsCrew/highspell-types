# HighSpell Babel Build Plugin

A Babel plugin to transpile HighSpell friendly names to minified names. This enables developers to write clean, readable code that gets transpiled to game-compatible code.

## Installation

```bash
pnpm add @bgscrew/highspell-babel-build-plugin
```

## Usage

### With Babel CLI

```bash
babel src --out-dir dist --plugins @bgscrew/highspell-babel-build-plugin
```

### With Babel Configuration

**.babelrc.js**

```javascript
module.exports = {
  plugins: ['@bgscrew/highspell-babel-build-plugin'],
};
```

**babel.config.js**

```javascript
module.exports = {
  plugins: ['@bgscrew/highspell-babel-build-plugin'],
};
```

### Programmatic Usage

```javascript
const babel = require('@babel/core');
const highspellPlugin = require('@bgscrew/highspell-babel-build-plugin');

const result = babel.transformSync(code, {
  plugins: [highspellPlugin],
});
```

## Transformations

The plugin performs these transformations:

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
- Babel 7+

## Contributing

This package is part of the HighSpell SDK monorepo. See the main README for contribution guidelines.
