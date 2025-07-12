/**
 * Auto-generated packet interfaces from method naming patterns.
 * Do not edit manually - regenerate with npm run generate-types.
 */

export namespace GeneratedPackets {
  export interface Game {
    param1: any;
    param2: any;
  }

  export interface GameStateUpdate {
    param1: any;
  }

  export interface NPCMoveTo {
    entityId: number;
    x: number;
    y: number;
    z: number;
  }

  export interface InGameHourChanged {
    param1: any;
  }

  export interface ObtainedResource {
    param1: any;
  }

  export interface IEnteredChunk {
    param1: any;
    param2: any;
  }

  export interface EnteredIdleState {
    param1: any;
    param2: any;
  }

  export interface LoginFailed {
    param1: any;
  }

  export interface LoggedIn {
    param1: any;
    param2: any;
    param3: any;
    param4: any;
    param5: any;
  }

  export interface Logout {
    param1: any;
  }

  export interface LogoutFailed {
    param1: any;
  }

  export interface LoggedOut {
    param1: any;
  }

  export interface StartedBanking {
    param1: any;
    param2: any;
  }

  export interface StoppedBanking {
    param1: any;
  }

  export interface ReceivedBankitems {
    param1: any;
  }

  export interface TradeRequested {
    param1: any;
    param2: any;
  }

  export interface PlayerAccepted {
    entityId: number;
  }

  export interface TradeStarted {
    param1: any;
    param2: any;
  }

  export interface TradeCancelled {
    param1: any;
    param2: any;
    param3: any;
  }

  export interface TradeCompleted {
    param1: any;
    param2: any;
    param3: any;
  }

  export interface CreatedItem {
    itemId: number;
  }

  export interface StartedTargeting {
    param1: any;
    param2: any;
    param3: any;
    param4: any;
  }

  export interface StoppedTargeting {
    param1: any;
    param2: any;
  }

  export interface StartedSkilling {
    skillType: Enums.Skill;
  }

  export interface StoppedSkilling {
    skillType: Enums.Skill;
  }

  export interface PlayerSkillLevelIncreased {
    entityId: number;
    skillType: Enums.Skill;
  }

  export interface PlayerCombatLevelIncreased {
    entityId: number;
  }

  export interface CookedItem {
    itemId: number;
  }

  export interface OvercookedItem {
    itemId: number;
  }

  export interface IncreasedCombatExp {
    skillType: Enums.Skill;
    expAmount: number;
  }

  export interface ChangeCombatStyle {
    param1: any;
    param2: any;
  }

  export interface CombatStyleChanged {
    param1: any;
  }

  export interface ChangeAutoRetaliate {
    param1: any;
  }

  export interface AutoRetaliateChanged {
    param1: any;
  }

  export interface StartedShopping {
    param1: any;
    param2: any;
    param3: any;
  }

  export interface StoppedShopping {
    param1: any;
    param2: any;
  }

  export interface UpdatedShopStock {
    param1: any;
    param2: any;
  }

  export interface StartedChangingAppearance {
    param1: any;
    param2: any;
  }

  export interface StoppedChangingAppearance {
    param1: any;
  }

  export interface ChangeAppearance {
    param1: any;
    param2: any;
    param3: any;
    param4: any;
    param5: any;
  }

  export interface ChangedAppearance {
    param1: any;
    param2: any;
    param3: any;
    param4: any;
    param5: any;
  }

  export interface MenuStateKeepAlivePing {
    menuType: Enums.MenuType;
  }

  export interface ToggleSprint {
    param1: any;
  }

  export interface ToggledSprint {
    param1: any;
    param2: any;
    param3: any;
  }

  export interface RestoredStats {
    param1: any;
  }

  export interface EntityExhaustedResources {
    entityId: number;
  }

  export interface EntityReplenishedResources {
    entityId: number;
  }

  export interface ShookTree {
    param1: any;
    param2: any;
    param3: any;
  }

  export interface GainedExp {
    skillType: Enums.Skill;
    expAmount: number;
  }

  export interface ShakeTreeResultMessage {
    message: string;
    senderId: number;
  }

  export interface OpenedSkillingMenu {
    skillType: Enums.Skill;
    menuType: Enums.MenuType;
  }

  export interface UsedItemOnItem {
    itemId: number;
  }

  export interface WentThroughDoor {
    param1: any;
    param2: any;
  }

  export interface CastTeleportSpell {
    x: number;
    y: number;
    z: number;
  }

  export interface CastedTeleportSpell {
    x: number;
    y: number;
    z: number;
  }

  export interface CastInventorySpell {
    param1: any;
    param2: any;
    param3: any;
    param4: any;
    param5: any;
  }

  export interface CastedInventorySpell {
    param1: any;
    param2: any;
    param3: any;
    param4: any;
  }

  export interface CastSingleCombatOrStatusSpell {
    param1: any;
    param2: any;
    param3: any;
  }

  export interface CastedSingleCombatOrStatusSpell {
    param1: any;
    param2: any;
    param3: any;
    param4: any;
    param5: any;
  }

  export interface ToggleAutoCast {
    param1: any;
  }

  export interface ToggledAutoCast {
    param1: any;
  }

  export interface SkillCurrentLevelChanged {
    skillType: Enums.Skill;
  }

  export interface ServerInfoMessage {
    message: string;
    senderId: number;
  }

  export interface ForcePublicMessage {
    message: string;
    senderId: number;
  }

  export interface QuestProgressed {
    param1: any;
    param2: any;
  }

  export interface CreatedUseItemOnItemItemsAction {
    itemId: number;
  }

  export interface PathfindingFailed {
    param1: any;
  }

  export interface FiredProjectile {
    param1: any;
    param2: any;
    param3: any;
    param4: any;
    param5: any;
  }

  export interface ServerShutdownCountdown {
    param1: any;
  }

  export interface ReconnectToServer {
    param1: any;
    param2: any;
  }

  export interface EntityStunned {
    entityId: number;
  }

  export interface GlobalPublicMessage {
    message: string;
    senderId: number;
  }

  export interface HealthRestored {
    param1: any;
    param2: any;
    param3: any;
  }

  export interface PlayerCountChanged {
    entityId: number;
  }

  export interface ForcedSkillCurrentLevelChanged {
    skillType: Enums.Skill;
  }

  export interface EndedNPCConversation {
    entityId: number;
  }

  export interface InvokedInventoryItemAction {
    itemId: number;
  }

  export interface UsedItemOnEntity {
    entityId: number;
    itemId: number;
  }

  export interface InsertAtBankStorageSlot {
    param1: any;
    param2: any;
  }

  export interface InsertedAtBankStorageSlot {
    param1: any;
  }

  export interface RemovedItemAtInventorySlot {
    itemId: number;
  }

  export interface AddedItemAtInventorySlot {
    itemId: number;
  }

  export interface ShowLootMenu {
    menuType: Enums.MenuType;
  }

  export interface ReorganizedInventorySlots {
    param1: any;
    param2: any;
    param3: any;
    param4: any;
    param5: any;
  }

  export interface UpdateTradeStatus {
    param1: any;
  }

  export interface StartedDigging {
    param1: any;
  }

  export interface StoppedDigging {
    param1: any;
  }

  export interface PlayerInfo {
    entityId: number;
  }

  export interface CaptchaAction {
    param1: any;
    param2: any;
  }

  export interface OpenedCaptchaScreen {
    param1: any;
  }

  export interface ReceivedCaptcha {
    param1: any;
    param2: any;
    param3: any;
  }

  export interface CaptchaResultAction {
    param1: any;
  }

  export interface MentalClarityChanged {
    param1: any;
    param2: any;
    param3: any;
  }
}
