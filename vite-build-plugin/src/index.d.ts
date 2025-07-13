/**
 * Vite plugin to transpile HighSpell friendly names to minified names.
 * This enables developers to write clean code that gets transpiled to game-compatible code.
 */

export interface VitePluginOptions {
  // Plugin options can be extended here
}

export interface TransformResult {
  code: string;
  map?: any;
}

/**
 * Vite plugin for HighSpell code transformations
 */
export default function viteHighSpellPlugin(options?: VitePluginOptions): {
  name: string;
  transform(code: string, id: string): TransformResult | null;
};
