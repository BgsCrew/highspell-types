const {
  friendlyToMinified,
} = require('@bgscrew/highspell-types/dist/mappings');

module.exports = function ({ types: t }) {
  return {
    name: 'babel-plugin-highspell',
    visitor: {
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
            const gameMinified = t.memberExpression(
              t.identifier('Game'),
              t.identifier(minifiedName)
            );

            const instanceAccess = t.memberExpression(
              gameMinified,
              t.identifier('Instance')
            );

            path.replaceWith(instanceAccess);
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
            // Replace Generated.Managers.NetworkManager.Instance with Game.FG
            path.replaceWith(
              t.memberExpression(
                t.identifier('Game'),
                t.identifier(minifiedName)
              )
            );
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
          // Remove the import and let the global game object be used instead
          // In a real game environment, the game object would be globally available
          path.remove();
        }
      },
    },
  };
};
