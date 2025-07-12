const babel = require('@babel/core');

// Create a mock plugin with the mappings
const createTestPlugin = () => {
  const friendlyToMinified = {
    GameLoop: 'pW',
    GameEngine: 'gW',
    InputManager: 'fW',
    EntityManager: 'Lk',
    NetworkManager: 'FG',
    PacketFactory: 'yV',
  };

  return function highspellBuildPlugin() {
    return {
      name: 'highspell-build-plugin',
      visitor: {
        // Transform member expressions like Core.GameLoop -> Game.pW
        MemberExpression(path) {
          // Handle Core.ManagerName patterns
          if (
            path.node.object &&
            path.node.object.type === 'Identifier' &&
            path.node.object.name === 'Core' &&
            path.node.property &&
            path.node.property.type === 'Identifier'
          ) {
            const friendlyName = path.node.property.name;
            const minifiedName = friendlyToMinified[friendlyName];

            if (minifiedName) {
              // Replace Core.GameLoop with Game.pW.Instance
              path.node.object.name = 'Game';
              path.node.property.name = minifiedName;

              // Add .Instance if this isn't already accessing a property
              const parent = path.parent;
              if (
                parent.type !== 'MemberExpression' ||
                parent.object !== path.node
              ) {
                // Wrap in another member expression to add .Instance
                const instanceAccess = {
                  type: 'MemberExpression',
                  object: path.node,
                  property: {
                    type: 'Identifier',
                    name: 'Instance',
                  },
                  computed: false,
                };
                path.replaceWith(instanceAccess);
              }
            }
          }

          // Handle Generated.Managers.ManagerName patterns
          if (
            path.node.object &&
            path.node.object.type === 'MemberExpression' &&
            path.node.object.object &&
            path.node.object.object.type === 'MemberExpression' &&
            path.node.object.object.object &&
            path.node.object.object.object.type === 'Identifier' &&
            path.node.object.object.object.name === 'Generated' &&
            path.node.object.object.property &&
            path.node.object.object.property.type === 'Identifier' &&
            path.node.object.object.property.name === 'Managers' &&
            path.node.object.property &&
            path.node.object.property.type === 'Identifier'
          ) {
            const friendlyName = path.node.object.property.name;
            const minifiedName = friendlyToMinified[friendlyName];

            if (minifiedName) {
              // Replace Generated.Managers.GameLoop.Instance with Game.pW.Instance
              path.replaceWith({
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'Game',
                  },
                  property: {
                    type: 'Identifier',
                    name: minifiedName,
                  },
                  computed: false,
                },
                property: path.node.property, // Keep the original property (usually 'Instance')
                computed: false,
              });
            }
          }
        },

        // Transform import statements to use game references
        ImportDeclaration(path) {
          const source = path.node.source.value;

          // Transform imports from highspell-types to game references
          if (
            source === '@bgscrew/highspell-types' ||
            source.includes('highspell-types')
          ) {
            // Remove the import and let the global Game object be used instead
            // In a real game environment, the Game object would be globally available
            path.remove();
          }
        },
      },
    };
  };
};

describe('HighSpell Build Plugin', () => {
  const transform = (code) => {
    const result = babel.transformSync(code, {
      plugins: [createTestPlugin()()],
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
});
