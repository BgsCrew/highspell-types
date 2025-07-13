const babel = require('@babel/core');
const plugin = require('../src/index');

describe('HighSpell Babel Build Plugin', () => {
  const transform = (code) => {
    const result = babel.transformSync(code, {
      plugins: [plugin],
      configFile: false,
      babelrc: false,
    });
    return result.code;
  };

  test('transforms Core.ManagerName to Game.minifiedName.Instance', () => {
    const input = 'const gameLoop = Core.GameLoop;';
    const output = transform(input);
    expect(output).toBe('const gameLoop = Game.pW.Instance;');
  });

  test('transforms Core.ManagerName method calls', () => {
    const input = 'Core.GameLoop.start();';
    const output = transform(input);
    expect(output).toBe('Game.pW.start();');
  });

  test('transforms Generated.Managers patterns', () => {
    const input = 'const network = Generated.Managers.NetworkManager.Instance;';
    const output = transform(input);
    expect(output).toBe('const network = Game.FG.Instance;');
  });

  test('removes highspell-types imports', () => {
    const input = `import { Core } from '@bgscrew/highspell-types';
const gameLoop = Core.GameLoop;`;
    const output = transform(input);
    expect(output).toBe('const gameLoop = Game.pW.Instance;');
  });

  test('handles multiple manager references', () => {
    const input = `
const gameLoop = Core.GameLoop;
const network = Core.NetworkManager;
const packets = Core.PacketFactory;
`;
    const output = transform(input);
    expect(output).toContain('Game.pW.Instance');
    expect(output).toContain('Game.FG.Instance');
    expect(output).toContain('Game.yV.Instance');
  });

  test('leaves unknown managers unchanged', () => {
    const input = 'const unknown = Core.UnknownManager;';
    const output = transform(input);
    expect(output).toBe('const unknown = Core.UnknownManager;');
  });

  test('handles nested property access correctly', () => {
    const input = 'Core.EntityManager.createEntity("player");';
    const output = transform(input);
    expect(output).toBe('Game.Lk.createEntity("player");');
  });

  test('transforms multiple Core managers in one statement', () => {
    const input =
      'const result = Core.GameLoop.isRunning() && Core.NetworkManager.isConnected();';
    const output = transform(input);
    expect(output).toBe(
      'const result = Game.pW.isRunning() && Game.FG.isConnected();'
    );
  });

  test('handles Generated.Managers with method calls', () => {
    const input = 'Generated.Managers.GameLoop.Instance.start();';
    const output = transform(input);
    expect(output).toBe('Game.pW.Instance.start();');
  });
});
