# HighSpell Vite Build Plugin

A Vite plugin to transpile HighSpell friendly names to minified names. This enables developers to write clean, readable code that gets transpiled to game-compatible code.

## Installation

```bash
pnpm add @bgscrew/highspell-vite-build-plugin
```

## Usage

### With Vite Configuration

**vite.config.js**

```javascript
import { defineConfig } from 'vite';
import highspellPlugin from '@bgscrew/highspell-vite-build-plugin';

export default defineConfig({
  plugins: [highspellPlugin()],
});
```

**vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import highspellPlugin from '@bgscrew/highspell-vite-build-plugin';

export default defineConfig({
  plugins: [highspellPlugin()],
});
```

### With Options

```javascript
import highspellPlugin from '@bgscrew/highspell-vite-build-plugin';

export default defineConfig({
  plugins: [
    highspellPlugin({
      // Plugin options (currently none)
    }),
  ],
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

## File Processing

The plugin only processes JavaScript and TypeScript files:

- `.js`
- `.jsx`
- `.ts`
- `.tsx`

Files in `node_modules` are automatically skipped for performance.

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
- Vite 4+

## Contributing

This package is part of the HighSpell SDK monorepo. See the main README for contribution guidelines.
