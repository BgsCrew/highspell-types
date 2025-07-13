/**
 * SWC plugin to transpile HighSpell friendly names to minified names.
 * This enables developers to write clean code that gets transpiled to game-compatible code.
 */

export interface SwcPluginOptions {
  // Plugin options can be extended here
}

/**
 * Main SWC plugin function
 */
export default function swcHighSpellPlugin(options?: SwcPluginOptions): {
  visitor: {
    Program(path: any): void;
  };
};
