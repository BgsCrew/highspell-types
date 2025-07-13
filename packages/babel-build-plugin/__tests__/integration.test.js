/**
 * Integration tests to verify all build plugins produce consistent output
 */

const babel = require('@babel/core');
const babelPlugin = require('../src/babel-plugin-highspell');

describe('Integration Tests', () => {
  const testCases = [
    {
      name: 'Core manager access',
      input: `
import { Core } from '@bgscrew/highspell-types';
const loop = Core.GameLoop;
loop.start();
`,
      expected: `const loop = Game.pW.Instance;
loop.start();`,
    },
    {
      name: 'Generated manager access',
      input: `
import { Generated } from '@bgscrew/highspell-types';
const network = Generated.Managers.NetworkManager.Instance;
network.connect();
`,
      expected: `const network = Game.FG;
network.connect();`,
    },
    {
      name: 'Method calls on Core managers',
      input: `
import { Core } from '@bgscrew/highspell-types';
Core.GameLoop.start();
Core.InputManager.getInput();
`,
      expected: `Game.pW.Instance.start();
Game.fW.Instance.getInput();`,
    },
    {
      name: 'Complex nested access',
      input: `
import { Core, Generated } from '@bgscrew/highspell-types';
const managers = {
  game: Core.GameLoop,
  network: Generated.Managers.NetworkManager.Instance
};
managers.game.update();
`,
      expected: `const managers = {
  game: Game.pW.Instance,
  network: Game.FG
};
managers.game.update();`,
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    test(`Babel plugin: ${name}`, () => {
      const result = babel.transformSync(input, {
        plugins: [babelPlugin],
        parserOpts: {
          plugins: ['typescript'],
        },
      });

      expect(result.code.trim()).toBe(expected.trim());
    });
  });
});
