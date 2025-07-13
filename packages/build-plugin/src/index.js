/**
 * Babel plugin to transpile HighSpell friendly names to minified names.
 * This enables developers to write clean code that gets transpiled to game-compatible code.
 */

const { friendlyToMinified } = require('@bgscrew/highspell-types');

module.exports = function highspellBuildPlugin() {
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

      // Transform identifier references to packet types
      Identifier(path) {
        // Don't transform if this is a property name or declaration
        if (
          path.isReferencedIdentifier() &&
          path.node.name.startsWith('Packets.') === false
        ) {
          // Handle packet type references
          const name = path.node.name;
          if (name.endsWith('Packet') || name.endsWith('Action')) {
            // This could be expanded to handle packet type transformations
            // For now, we mainly focus on manager name transformations
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

// Also export as default for ES6 compatibility
module.exports.default = module.exports;
