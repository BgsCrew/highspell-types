const swcHighSpellPlugin = require('../src/index');

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
});
