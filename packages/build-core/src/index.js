/**
 * Core transformation logic shared across all HighSpell build plugins.
 * This module provides the common functionality for transforming friendly names
 * to minified names in different build tools.
 */

const { friendlyToMinified } = require('@bgscrew/highspell-types/mappings');

/**
 * Transform patterns used for HighSpell code transformations
 */
const TRANSFORM_PATTERNS = {
  CORE_MEMBER: 'Core.ManagerName',
  GENERATED_MANAGERS: 'Generated.Managers.ManagerName',
  IMPORT: '@bgscrew/highspell-types',
};

/**
 * Checks if a node represents a Core.ManagerName pattern
 * @param {Object} node - AST node to check
 * @returns {Object|null} - Transformation info or null if not a match
 */
function isCoreManagerAccess(node) {
  if (
    node.object &&
    node.object.type === 'Identifier' &&
    node.object.name === 'Core' &&
    node.property &&
    node.property.type === 'Identifier'
  ) {
    const friendlyName = node.property.name;
    const minifiedName = friendlyToMinified[friendlyName];

    if (minifiedName) {
      return {
        type: 'core-manager',
        friendlyName,
        minifiedName,
        shouldAddInstance: true,
      };
    }
  }
  return null;
}

/**
 * Checks if a node represents a Generated.Managers.ManagerName pattern
 * @param {Object} node - AST node to check
 * @returns {Object|null} - Transformation info or null if not a match
 */
function isGeneratedManagerAccess(node) {
  if (
    node.object &&
    node.object.type === 'MemberExpression' &&
    node.object.object &&
    node.object.object.type === 'MemberExpression' &&
    node.object.object.object &&
    node.object.object.object.type === 'Identifier' &&
    node.object.object.object.name === 'Generated' &&
    node.object.object.property &&
    node.object.object.property.type === 'Identifier' &&
    node.object.object.property.name === 'Managers' &&
    node.object.property &&
    node.object.property.type === 'Identifier'
  ) {
    const friendlyName = node.object.property.name;
    const minifiedName = friendlyToMinified[friendlyName];

    if (minifiedName) {
      return {
        type: 'generated-manager',
        friendlyName,
        minifiedName,
        shouldAddInstance: false, // Already has .Instance in the pattern
      };
    }
  }
  return null;
}

/**
 * Checks if an import should be removed
 * @param {string} source - Import source
 * @returns {boolean} - True if import should be removed
 */
function shouldRemoveImport(source) {
  return (
    source === '@bgscrew/highspell-types' || source.includes('highspell-types')
  );
}

/**
 * Creates a Game.minifiedName.Instance structure for different AST builders
 * @param {Function} createIdentifier - Function to create identifier nodes
 * @param {Function} createMemberExpression - Function to create member expression nodes
 * @param {string} minifiedName - The minified manager name
 * @param {boolean} addInstance - Whether to add .Instance
 * @returns {Object} - AST node representing Game.minifiedName[.Instance]
 */
function createGameManagerAccess(
  createIdentifier,
  createMemberExpression,
  minifiedName,
  addInstance = true
) {
  const gameId = createIdentifier('Game');
  const gameMinified = createMemberExpression(
    gameId,
    createIdentifier(minifiedName)
  );

  if (addInstance) {
    return createMemberExpression(gameMinified, createIdentifier('Instance'));
  }

  return gameMinified;
}

/**
 * Generic transformation function that can be used by different build tools
 * @param {Object} node - AST node to transform
 * @param {Function} createIdentifier - Function to create identifier nodes
 * @param {Function} createMemberExpression - Function to create member expression nodes
 * @returns {Object|null} - Transformed node or null if no transformation needed
 */
function transformHighSpellNode(
  node,
  createIdentifier,
  createMemberExpression
) {
  // Check for Core.ManagerName pattern
  const coreMatch = isCoreManagerAccess(node);
  if (coreMatch) {
    return createGameManagerAccess(
      createIdentifier,
      createMemberExpression,
      coreMatch.minifiedName,
      coreMatch.shouldAddInstance
    );
  }

  // Check for Generated.Managers.ManagerName pattern
  const generatedMatch = isGeneratedManagerAccess(node);
  if (generatedMatch) {
    return createGameManagerAccess(
      createIdentifier,
      createMemberExpression,
      generatedMatch.minifiedName,
      false // Keep original property (usually .Instance)
    );
  }

  return null;
}

/**
 * Get all available transformations for debugging/logging
 * @returns {Object} - Object containing mapping information
 */
function getTransformationInfo() {
  return {
    friendlyToMinified,
    patterns: TRANSFORM_PATTERNS,
    availableManagers: Object.keys(friendlyToMinified),
  };
}

module.exports = {
  isCoreManagerAccess,
  isGeneratedManagerAccess,
  shouldRemoveImport,
  createGameManagerAccess,
  transformHighSpellNode,
  getTransformationInfo,
  TRANSFORM_PATTERNS,
};
