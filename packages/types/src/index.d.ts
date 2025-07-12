/// <reference path="generated.d.ts" />

/**
 * This is the main developer-facing API file for the game extension.
 * It re-exports the auto-generated types from `generated.d.ts` with cleaner names and documentation.
 * This file should be manually maintained to provide a stable and ergonomic API.
 */

import * as Generated from './generated';

export * from './generated';
export * from './mappings';

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

  // --- Managers ---
  export const GameLoop = Generated.Managers.GameLoop.Instance;
  export const GameEngine = Generated.Managers.GameEngine.Instance;
  export const InputManager = Generated.Managers.InputManager.Instance;
  export const WildernessManager =
    Generated.Managers.WildernessManager.Instance;
  export const EntityManager = Generated.Managers.EntityManager.Instance;
  export const SpellManager = Generated.Managers.SpellManager.Instance;
  export const WorldManager = Generated.Managers.WorldManager.Instance;
  export const SpellActionManager =
    Generated.Managers.SpellActionManager.Instance;
  export const PacketFactory = Generated.Managers.PacketFactory.Instance;
  export const UIManager = Generated.Managers.UIManager.Instance;
  export const WorldEntityManger =
    Generated.Managers.WorldEntityManger.Instance;
  export const GroundItemManager =
    Generated.Managers.GroundItemManager.Instance;
  export const MeshManager = Generated.Managers.MeshManager.Instance;
  export const EntityFactory = Generated.Managers.EntityFactory.Instance;
  export const AppearanceManager =
    Generated.Managers.AppearanceManager.Instance;
  export const InventoryManager = Generated.Managers.InventoryManager.Instance;
  export const QuestManager = Generated.Managers.QuestManager.Instance;
  export const ProjectileManager =
    Generated.Managers.ProjectileManager.Instance;
  export const ChatFilterManager =
    Generated.Managers.ChatFilterManager.Instance;
  export const SocialManager = Generated.Managers.SocialManager.Instance;
  export const PlayerStatsManager =
    Generated.Managers.PlayerStatsManager.Instance;
  export const ObjectUrlManager = Generated.Managers.ObjectUrlManager.Instance;
  export const FogManager = Generated.Managers.FogManager.Instance;
  export const CacheManager = Generated.Managers.CacheManager.Instance;
  export const BitmapManager = Generated.Managers.BitmapManager.Instance;
}

// It's good practice to export the top-level namespace for easy access.
export default Core;
