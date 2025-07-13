/// <reference path="generated.d.ts" />

/**
 * This is the main developer-facing API file for the game extension.
 * It re-exports the auto-generated types from `generated.d.ts` with cleaner names and documentation.
 * Manager exports are now auto-generated in core-exports.d.ts
 */

export * from './generated';
export * from './mappings';
export * from './packet-bases';

// Re-export auto-generated Core namespace with manager exports
export { Core } from './core-exports';

// Merge additional types into the Core namespace
declare module './core-exports' {
  namespace Core {
    // --- Entities ---
    export type Entity = Definitions.Entity;
    export type Player = Definitions.Player;
    export type CombatStats = Definitions.CombatStats;
    export type SkillStats = Definitions.SkillStats;
    export type Appearance = Definitions.Appearance;
  }
}
