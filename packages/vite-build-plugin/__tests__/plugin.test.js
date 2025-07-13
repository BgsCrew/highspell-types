const viteHighSpellPlugin = require('../src/index');

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
});
