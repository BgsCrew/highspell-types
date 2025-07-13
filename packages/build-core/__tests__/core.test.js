const {
  isCoreManagerAccess,
  isGeneratedManagerAccess,
  shouldRemoveImport,
  createGameManagerAccess,
  transformHighSpellNode,
  getTransformationInfo,
} = require('../src/index');
const fs = require('fs');
const path = require('path');

describe('HighSpell Build Core', () => {
  const createIdentifier = (name) => ({ type: 'Identifier', name });
  const createMemberExpression = (object, property) => ({
    type: 'MemberExpression',
    object,
    property,
    computed: false,
  });

  describe('isCoreManagerAccess', () => {
    test('identifies Core.GameLoop pattern', () => {
      const node = {
        object: { type: 'Identifier', name: 'Core' },
        property: { type: 'Identifier', name: 'GameLoop' },
      };

      const result = isCoreManagerAccess(node);
      expect(result).toEqual({
        type: 'core-manager',
        friendlyName: 'GameLoop',
        minifiedName: 'pW',
        shouldAddInstance: true,
      });
    });

    test('returns null for non-Core patterns', () => {
      const node = {
        object: { type: 'Identifier', name: 'Other' },
        property: { type: 'Identifier', name: 'GameLoop' },
      };

      const result = isCoreManagerAccess(node);
      expect(result).toBeNull();
    });

    test('returns null for unknown managers', () => {
      const node = {
        object: { type: 'Identifier', name: 'Core' },
        property: { type: 'Identifier', name: 'UnknownManager' },
      };

      const result = isCoreManagerAccess(node);
      expect(result).toBeNull();
    });
  });

  describe('isGeneratedManagerAccess', () => {
    test('identifies Generated.Managers.GameLoop pattern', () => {
      const node = {
        object: {
          type: 'MemberExpression',
          object: {
            type: 'MemberExpression',
            object: { type: 'Identifier', name: 'Generated' },
            property: { type: 'Identifier', name: 'Managers' },
          },
          property: { type: 'Identifier', name: 'GameLoop' },
        },
      };

      const result = isGeneratedManagerAccess(node);
      expect(result).toEqual({
        type: 'generated-manager',
        friendlyName: 'GameLoop',
        minifiedName: 'pW',
        shouldAddInstance: false,
      });
    });

    test('returns null for non-Generated patterns', () => {
      const node = {
        object: {
          type: 'MemberExpression',
          object: {
            type: 'MemberExpression',
            object: { type: 'Identifier', name: 'Other' },
            property: { type: 'Identifier', name: 'Managers' },
          },
          property: { type: 'Identifier', name: 'GameLoop' },
        },
      };

      const result = isGeneratedManagerAccess(node);
      expect(result).toBeNull();
    });
  });

  describe('shouldRemoveImport', () => {
    test('removes @bgscrew/highspell-types imports', () => {
      expect(shouldRemoveImport('@bgscrew/highspell-types')).toBe(true);
    });

    test('removes any highspell-types imports', () => {
      expect(shouldRemoveImport('some-package/highspell-types')).toBe(true);
    });

    test('keeps other imports', () => {
      expect(shouldRemoveImport('react')).toBe(false);
      expect(shouldRemoveImport('@babel/core')).toBe(false);
    });
  });

  describe('createGameManagerAccess', () => {
    test('creates Game.minifiedName.Instance by default', () => {
      const result = createGameManagerAccess(
        createIdentifier,
        createMemberExpression,
        'pW'
      );

      expect(result).toEqual({
        type: 'MemberExpression',
        object: {
          type: 'MemberExpression',
          object: { type: 'Identifier', name: 'Game' },
          property: { type: 'Identifier', name: 'pW' },
          computed: false,
        },
        property: { type: 'Identifier', name: 'Instance' },
        computed: false,
      });
    });

    test('creates Game.minifiedName without Instance when specified', () => {
      const result = createGameManagerAccess(
        createIdentifier,
        createMemberExpression,
        'pW',
        false
      );

      expect(result).toEqual({
        type: 'MemberExpression',
        object: { type: 'Identifier', name: 'Game' },
        property: { type: 'Identifier', name: 'pW' },
        computed: false,
      });
    });
  });

  describe('transformHighSpellNode', () => {
    test('transforms Core.GameLoop nodes', () => {
      const node = {
        object: { type: 'Identifier', name: 'Core' },
        property: { type: 'Identifier', name: 'GameLoop' },
      };

      const result = transformHighSpellNode(
        node,
        createIdentifier,
        createMemberExpression
      );

      expect(result.object.object.name).toBe('Game');
      expect(result.object.property.name).toBe('pW');
      expect(result.property.name).toBe('Instance');
    });

    test('transforms Generated.Managers.GameLoop nodes', () => {
      const node = {
        object: {
          type: 'MemberExpression',
          object: {
            type: 'MemberExpression',
            object: { type: 'Identifier', name: 'Generated' },
            property: { type: 'Identifier', name: 'Managers' },
          },
          property: { type: 'Identifier', name: 'GameLoop' },
        },
      };

      const result = transformHighSpellNode(
        node,
        createIdentifier,
        createMemberExpression
      );

      expect(result.object.name).toBe('Game');
      expect(result.property.name).toBe('pW');
    });

    test('returns null for non-matching nodes', () => {
      const node = {
        object: { type: 'Identifier', name: 'Other' },
        property: { type: 'Identifier', name: 'GameLoop' },
      };

      const result = transformHighSpellNode(
        node,
        createIdentifier,
        createMemberExpression
      );
      expect(result).toBeNull();
    });
  });

  describe('getTransformationInfo', () => {
    test('returns transformation information', () => {
      const info = getTransformationInfo();

      expect(info).toHaveProperty('friendlyToMinified');
      expect(info).toHaveProperty('patterns');
      expect(info).toHaveProperty('availableManagers');

      expect(info.friendlyToMinified.GameLoop).toBe('pW');
      expect(info.availableManagers).toContain('GameLoop');
      expect(info.patterns.CORE_MEMBER).toBe('Core.ManagerName');
    });
  });

  describe('Example Integration', () => {
    test('Example usage file exists and runs without errors', () => {
      const examplePath = path.join(__dirname, '../example/usage.js');
      expect(fs.existsSync(examplePath)).toBe(true);

      // The example should be able to require the core module
      expect(() => {
        require('../example/usage.js');
      }).not.toThrow();
    });

    test('Example demonstrates all core functions', () => {
      const examplePath = path.join(__dirname, '../example/usage.js');
      const exampleContent = fs.readFileSync(examplePath, 'utf8');

      // Verify example uses all main functions
      expect(exampleContent).toContain('isCoreManagerAccess');
      expect(exampleContent).toContain('isGeneratedManagerAccess');
      expect(exampleContent).toContain('shouldRemoveImport');
      expect(exampleContent).toContain('transformHighSpellNode');
      expect(exampleContent).toContain('getTransformationInfo');
      expect(exampleContent).toContain('createGameManagerAccess');
      expect(exampleContent).toContain('TRANSFORM_PATTERNS');
    });
  });
});
