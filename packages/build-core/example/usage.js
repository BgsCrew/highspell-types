/**
 * Example of using @bgscrew/highspell-build-core directly
 * This demonstrates the core transformation functions
 */

const {
  isCoreManagerAccess,
  isGeneratedManagerAccess,
  shouldRemoveImport,
  transformHighSpellNode,
  getTransformationInfo,
  createGameManagerAccess,
  TRANSFORM_PATTERNS,
} = require('../src/index.js');

// Mock AST node creators for demonstration
const createIdentifier = (name) => ({ type: 'Identifier', name });
const createMemberExpression = (object, property) => ({
  type: 'MemberExpression',
  object,
  property,
});

// Example: Check transformation patterns
console.log('Available transformation patterns:');
console.log(TRANSFORM_PATTERNS);

// Example: Get transformation info
const info = getTransformationInfo();
console.log('\nAvailable managers:', Object.keys(info.availableManagers));

// Example: Check if imports should be removed
console.log('\nImport removal checks:');
console.log(
  'Should remove @bgscrew/highspell-types:',
  shouldRemoveImport('@bgscrew/highspell-types')
);
console.log('Should remove lodash:', shouldRemoveImport('lodash'));

// Example: Create game manager access
console.log('\nCreating game manager access:');
const gameAccess = createGameManagerAccess(
  createIdentifier,
  createMemberExpression,
  'pW',
  true
);
console.log('Game.pW.Instance:', JSON.stringify(gameAccess, null, 2));

// Example: Mock node checking (in real usage, these would be actual AST nodes)
const mockCoreNode = {
  type: 'MemberExpression',
  object: { name: 'Core' },
  property: { name: 'GameLoop' },
};

const mockGeneratedNode = {
  type: 'MemberExpression',
  object: {
    type: 'MemberExpression',
    object: {
      type: 'MemberExpression',
      object: { name: 'Generated' },
      property: { name: 'Managers' },
    },
    property: { name: 'NetworkManager' },
  },
  property: { name: 'Instance' },
};

console.log('\nNode type checking:');
console.log('Is Core manager access:', isCoreManagerAccess(mockCoreNode));
console.log(
  'Is Generated manager access:',
  isGeneratedManagerAccess(mockGeneratedNode)
);
