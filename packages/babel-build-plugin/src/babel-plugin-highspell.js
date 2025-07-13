const {
  transformHighSpellNode,
  shouldRemoveImport,
} = require('@bgscrew/highspell-build-core');

module.exports = function ({ types: t }) {
  // Helper functions for the core library
  const createIdentifier = (name) => t.identifier(name);
  const createMemberExpression = (object, property) =>
    t.memberExpression(object, property);

  return {
    name: 'babel-plugin-highspell',
    visitor: {
      MemberExpression(path) {
        const node = path.node;

        // Use the core library to transform the node
        const transformed = transformHighSpellNode(
          node,
          createIdentifier,
          createMemberExpression
        );

        if (transformed) {
          path.replaceWith(transformed);
        }
      },

      ImportDeclaration(path) {
        const source = path.node.source.value;

        // Use the core library to check if import should be removed
        if (shouldRemoveImport(source)) {
          path.remove();
        }
      },
    },
  };
};
