/**
 * Vite plugin to transpile HighSpell friendly names to minified names.
 * This enables developers to write clean code that gets transpiled to game-compatible code.
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const {
  isCoreManagerAccess,
  isGeneratedManagerAccess,
  shouldRemoveImport,
} = require('@bgscrew/highspell-build-core');

/**
 * Vite plugin for HighSpell code transformations
 * @param {Object} options - Plugin options
 * @returns {Object} - Vite plugin configuration
 */
function viteHighSpellPlugin(options = {}) {
  return {
    name: 'highspell-vite-build-plugin',
    transform(code, id) {
      // Only transform JavaScript/TypeScript files
      if (!/\.(js|jsx|ts|tsx)$/.test(id)) {
        return null;
      }

      // Skip node_modules
      if (id.includes('node_modules')) {
        return null;
      }

      try {
        // Parse the code into an AST
        const ast = parser.parse(code, {
          sourceType: 'module',
          plugins: [
            'jsx',
            'typescript',
            'decorators-legacy',
            'classProperties',
            'objectRestSpread',
            'asyncGenerators',
            'functionBind',
            'exportDefaultFrom',
            'exportNamespaceFrom',
            'dynamicImport',
            'nullishCoalescingOperator',
            'optionalChaining',
          ],
        });

        let hasTransformations = false;

        // Traverse and transform the AST
        traverse(ast, {
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
              hasTransformations = true;
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
              hasTransformations = true;
            }
          },

          ImportDeclaration(path) {
            const source = path.node.source.value;
            if (shouldRemoveImport(source)) {
              path.remove();
              hasTransformations = true;
            }
          },
        });

        // If no transformations were made, return null (no change)
        if (!hasTransformations) {
          return null;
        }

        // Generate the transformed code
        const result = generate(ast, {
          retainLines: false,
          compact: false,
        });

        return {
          code: result.code,
          map: result.map,
        };
      } catch (error) {
        // If parsing fails, just return the original code
        console.warn(
          `HighSpell Vite plugin: Failed to parse ${id}:`,
          error.message
        );
        return null;
      }
    },
  };
}

module.exports = viteHighSpellPlugin;
module.exports.default = viteHighSpellPlugin;
