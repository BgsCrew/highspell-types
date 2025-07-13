const swcHighSpellPlugin = require('../src/index');
const fs = require('fs');
const path = require('path');

describe('HighSpell SWC Build Plugin', () => {
  test('creates a valid SWC plugin', () => {
    const plugin = swcHighSpellPlugin();

    expect(plugin).toHaveProperty('visitor');
    expect(plugin.visitor).toHaveProperty('Program');
    expect(typeof plugin.visitor.Program).toBe('function');
  });

  test('plugin can be created with options', () => {
    const plugin = swcHighSpellPlugin({ someOption: true });

    expect(plugin).toHaveProperty('visitor');
  });

  // Note: Full SWC integration tests would require the actual SWC compiler
  // These are basic structure tests to ensure the plugin is properly formed

  describe('Example Integration', () => {
    test('Example input file exists and contains expected patterns', () => {
      const examplePath = path.join(__dirname, '../example/input.js');
      const exampleInput = fs.readFileSync(examplePath, 'utf8');

      // Verify example contains the patterns we expect to transform
      expect(exampleInput).toContain('Core.GameLoop');
      expect(exampleInput).toContain('Core.InputManager');
      expect(exampleInput).toContain('Core.EntityManager');
      expect(exampleInput).toContain(
        'Generated.Managers.NetworkManager.Instance'
      );
      expect(exampleInput).toContain(
        'Generated.Managers.PacketFactory.Instance'
      );

      // Verify import statements
      expect(exampleInput).toContain(
        "import { Core, Generated } from '@bgscrew/highspell-types';"
      );
    });

    test('Example configuration is valid', () => {
      const configPath = path.join(__dirname, '../example/.swcrc');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

      expect(config).toHaveProperty('plugins');
      expect(Array.isArray(config.plugins)).toBe(true);
      expect(config.plugins[0][0]).toBe('../src/index.js');
    });
  });
});
