/**
 * SWC plugin to transpile HighSpell friendly names to minified names.
 * This enables developers to write clean code that gets transpiled to game-compatible code.
 */

const {
  transformHighSpellNode,
  shouldRemoveImport,
} = require('@bgscrew/highspell-build-core');

/**
 * SWC visitor function for transforming HighSpell code
 * @param {Object} node - SWC AST node
 * @returns {Object|null} - Transformed node or original node
 */
function visitNode(node) {
  // Transform member expressions
  if (node.type === 'MemberExpression') {
    const createIdentifier = (name) => ({
      type: 'Identifier',
      value: name,
      optional: false,
    });

    const createMemberExpression = (object, property) => ({
      type: 'MemberExpression',
      object,
      property,
      computed: false,
    });

    const transformed = transformHighSpellNode(
      node,
      createIdentifier,
      createMemberExpression
    );

    if (transformed) {
      return transformed;
    }
  }

  // Transform import declarations
  if (node.type === 'ImportDeclaration') {
    const source = node.source.value;
    if (shouldRemoveImport(source)) {
      // Return null to remove the import
      return null;
    }
  }

  return node;
}

/**
 * Main SWC plugin function
 * @param {Object} options - Plugin options
 * @returns {Object} - SWC plugin configuration
 */
function swcHighSpellPlugin(options = {}) {
  return {
    visitor: {
      Program(path) {
        // Transform all nodes in the program
        function transformAstNode(node) {
          if (node && typeof node === 'object') {
            // Apply transformation to current node
            const transformedNode = visitNode(node);

            // If the node was removed (null), return null
            if (transformedNode === null) {
              return null;
            }

            // Recursively transform child nodes
            Object.keys(transformedNode).forEach((key) => {
              if (Array.isArray(transformedNode[key])) {
                transformedNode[key] = transformedNode[key]
                  .map(transformAstNode)
                  .filter((item) => item !== null);
              } else if (
                transformedNode[key] &&
                typeof transformedNode[key] === 'object'
              ) {
                transformedNode[key] = transformAstNode(transformedNode[key]);
              }
            });

            return transformedNode;
          }
          return node;
        }

        // Transform the entire AST
        path.node = transformAstNode(path.node);
      },
    },
  };
}

module.exports = swcHighSpellPlugin;
module.exports.default = swcHighSpellPlugin;
