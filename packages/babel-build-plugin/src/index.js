/**
 * Babel plugin to transpile HighSpell friendly names to minified names.
 * This enables developers to write clean code that gets transpiled to game-compatible code.
 */

const {
  isCoreManagerAccess,
  isGeneratedManagerAccess,
  shouldRemoveImport,
} = require('@bgscrew/highspell-build-core');

module.exports = function highspellBabelBuildPlugin() {
  return {
    name: 'highspell-babel-build-plugin',
    visitor: {
      // Transform member expressions like Core.GameLoop -> Game.pW
      MemberExpression(path) {
        // Check for Core.ManagerName pattern
        const coreMatch = isCoreManagerAccess(path.node);
        if (coreMatch) {
          // Replace Core.GameLoop with Game.pW.Instance
          path.node.object.name = 'Game';
          path.node.property.name = coreMatch.minifiedName;

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
          return;
        }

        // Check for Generated.Managers.ManagerName pattern
        const generatedMatch = isGeneratedManagerAccess(path.node);
        if (generatedMatch) {
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
                name: generatedMatch.minifiedName,
              },
              computed: false,
            },
            property: path.node.property, // Keep the original property (usually 'Instance')
            computed: false,
          });
        }
      },

      // Transform import statements to use game references
      ImportDeclaration(path) {
        const source = path.node.source.value;
        if (shouldRemoveImport(source)) {
          // Remove the import and let the global Game object be used instead
          path.remove();
        }
      },
    },
  };
};

// Also export as default for ES6 compatibility
module.exports.default = module.exports;
