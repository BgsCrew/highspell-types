const viteHighSpellPlugin = require('../src/index');
const fs = require('fs');
const path = require('path');

describe('HighSpell Vite Build Plugin', () => {
  test('creates a valid Vite plugin', () => {
    const plugin = viteHighSpellPlugin();

    expect(plugin).toHaveProperty('name');
    expect(plugin).toHaveProperty('transform');
    expect(plugin.name).toBe('highspell-vite-build-plugin');
    expect(typeof plugin.transform).toBe('function');
  });

  test('plugin can be created with options', () => {
    const plugin = viteHighSpellPlugin({ someOption: true });

    expect(plugin).toHaveProperty('name');
    expect(plugin).toHaveProperty('transform');
  });

  test('transforms Core.GameLoop to Game.pW.Instance', () => {
    const plugin = viteHighSpellPlugin();
    const code = 'const gameLoop = Core.GameLoop;';
    const id = 'test.js';

    const result = plugin.transform(code, id);

    expect(result).toBeTruthy();
    expect(result.code).toContain('Game.pW.Instance');
  });

  test('transforms Generated.Managers patterns', () => {
    const plugin = viteHighSpellPlugin();
    const code = 'const network = Generated.Managers.NetworkManager.Instance;';
    const id = 'test.js';

    const result = plugin.transform(code, id);

    expect(result).toBeTruthy();
    expect(result.code).toContain('Game.FG.Instance');
  });

  test('removes highspell-types imports', () => {
    const plugin = viteHighSpellPlugin();
    const code = `import { Core } from '@bgscrew/highspell-types';
const gameLoop = Core.GameLoop;`;
    const id = 'test.js';

    const result = plugin.transform(code, id);

    expect(result).toBeTruthy();
    expect(result.code).not.toContain('@bgscrew/highspell-types');
    expect(result.code).toContain('Game.pW.Instance');
  });

  test('skips non-JS files', () => {
    const plugin = viteHighSpellPlugin();
    const code = 'const gameLoop = Core.GameLoop;';
    const id = 'test.css';

    const result = plugin.transform(code, id);

    expect(result).toBeNull();
  });

  test('skips node_modules', () => {
    const plugin = viteHighSpellPlugin();
    const code = 'const gameLoop = Core.GameLoop;';
    const id = 'node_modules/some-package/test.js';

    const result = plugin.transform(code, id);

    expect(result).toBeNull();
  });

  test('returns null for code without transformations', () => {
    const plugin = viteHighSpellPlugin();
    const code = 'const other = something.else;';
    const id = 'test.js';

    const result = plugin.transform(code, id);

    expect(result).toBeNull();
  });

  test('handles method calls on Core managers', () => {
    const plugin = viteHighSpellPlugin();
    const code = 'Core.GameLoop.start();';
    const id = 'test.js';

    const result = plugin.transform(code, id);

    expect(result).toBeTruthy();
    expect(result.code).toContain('Game.pW.start()');
  });

  describe('Example Integration', () => {
    test('Example input transforms correctly', () => {
      const plugin = viteHighSpellPlugin();
      const examplePath = path.join(__dirname, '../example/input.js');
      const exampleInput = fs.readFileSync(examplePath, 'utf8');

      const result = plugin.transform(exampleInput, 'example/input.js');

      expect(result).toBeTruthy();

      // Verify transformations are applied
      expect(result.code).toContain('Game.pW.Instance');
      expect(result.code).toContain('Game.fW.Instance');
      expect(result.code).toContain('Game.Lk.Instance');
      expect(result.code).toContain('Game.FG');
      expect(result.code).toContain('Game.yV');

      // Verify imports are removed
      expect(result.code).not.toContain(
        "import { Core, Generated } from '@bgscrew/highspell-types';"
      );
    });

    test('Example produces expected manager mappings', () => {
      const plugin = viteHighSpellPlugin();
      const examplePath = path.join(__dirname, '../example/input.js');
      const exampleInput = fs.readFileSync(examplePath, 'utf8');

      const result = plugin.transform(exampleInput, 'example/input.js');

      const expectedMappings = [
        { friendly: 'Core.GameLoop', minified: 'Game.pW.Instance' },
        { friendly: 'Core.InputManager', minified: 'Game.fW.Instance' },
        { friendly: 'Core.EntityManager', minified: 'Game.Lk.Instance' },
        {
          friendly: 'Generated.Managers.NetworkManager.Instance',
          minified: 'Game.FG',
        },
        {
          friendly: 'Generated.Managers.PacketFactory.Instance',
          minified: 'Game.yV',
        },
      ];

      expectedMappings.forEach(({ friendly, minified }) => {
        // Should not contain friendly names
        expect(result.code).not.toContain(friendly);
        // Should contain minified names
        expect(result.code).toContain(minified);
      });
    });

    test('Example configuration is valid', () => {
      const configPath = path.join(__dirname, '../example/vite.config.js');
      const configContent = fs.readFileSync(configPath, 'utf8');

      // Verify the config imports the plugin
      expect(configContent).toContain(
        "import highspellPlugin from '../src/index.js';"
      );
      expect(configContent).toContain('plugins: [highspellPlugin()]');
    });
  });
});
