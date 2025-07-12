const {
  friendlyToMinified,
} = require('@bgscrew/highspell-types/dist/mappings');

module.exports = function ({ types: t }) {
  return {
    name: 'babel-plugin-highspell',
    visitor: {
      MemberExpression(path) {
        // Check if we are accessing a property of the 'Core' object
        // e.g., Core.GameLoop
        if (!path.get('object').isIdentifier({ name: 'Core' })) {
          return;
        }

        const property = path.get('property');
        const propertyName = property.node.name;

        // Look up the friendly name in our mapping
        const minifiedName = friendlyToMinified[propertyName];

        if (minifiedName) {
          // If a mapping exists, replace the friendly name with the minified one.
          // We also need to change the object from 'Core' to 'game.Managers'
          // and the property to the minified manager's 'Instance'.
          // So, Core.GameLoop becomes game.Managers.pW.Instance

          const gameManagers = t.memberExpression(
            t.identifier('game'),
            t.identifier('Managers')
          );

          const minifiedManager = t.memberExpression(
            gameManagers,
            t.identifier(minifiedName)
          );

          const instanceProperty = t.memberExpression(
            minifiedManager,
            t.identifier('Instance')
          );

          // Replace the entire 'Core.GameLoop' expression
          path.replaceWith(instanceProperty);
        }
      },
    },
  };
};
