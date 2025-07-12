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
export { Core, default } from './core-exports';

export namespace Core {
  // --- Entities ---
  export type Entity = Definitions.Entity;
  export type Player = Definitions.Player;
  export type CombatStats = Definitions.CombatStats;
  export type SkillStats = Definitions.SkillStats;
  export type Appearance = Definitions.Appearance;

  // --- Packets ---
  export * from './packets';

  // --- Enums ---
  export * from '../dist/enums';

  // --- Definitions ---
  export * from '../dist/definitions';
}
