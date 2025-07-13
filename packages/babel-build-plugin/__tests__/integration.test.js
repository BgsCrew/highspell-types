/**
 * Integration tests to verify all build plugins produce consistent output
 */

const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');
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

  describe('Example Integration', () => {
    test('Example input transforms correctly', () => {
      const examplePath = path.join(__dirname, '../example/input.js');
      const exampleInput = fs.readFileSync(examplePath, 'utf8');

      const result = babel.transformSync(exampleInput, {
        plugins: [babelPlugin],
        parserOpts: {
          plugins: ['typescript'],
        },
      });

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

      // Verify the transformed code doesn't contain syntax errors
      expect(result.code).toBeDefined();
      expect(result.code.length).toBeGreaterThan(0);
    });

    test('Example produces expected manager mappings', () => {
      const examplePath = path.join(__dirname, '../example/input.js');
      const exampleInput = fs.readFileSync(examplePath, 'utf8');

      const result = babel.transformSync(exampleInput, {
        plugins: [babelPlugin],
        parserOpts: {
          plugins: ['typescript'],
        },
      });

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
  });
});
