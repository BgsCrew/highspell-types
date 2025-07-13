/**
 * Auto-generated type guard functions for runtime type checking.
 * Do not edit manually - regenerate with npm run generate-types.
 */

export namespace TypeGuards {
  // --- Enum Type Guards ---
  export function isTargetAction(value: any): value is Enums.TargetAction {
    return typeof value === "string" && [].includes(value);
  }

  export function isMenuType(value: any): value is Enums.MenuType {
    return typeof value === "string" && [].includes(value);
  }

  export function isEntityType(value: any): value is Enums.EntityType {
    return typeof value === "string" && [].includes(value);
  }

  export function isDamageType(value: any): value is Enums.DamageType {
    return typeof value === "string" && [].includes(value);
  }

  export function isReorganizeType(value: any): value is Enums.ReorganizeType {
    return typeof value === "string" && ["a", "0"].includes(value);
  }

  export function isItemAction(value: any): value is Enums.ItemAction {
    return typeof value === "string" && ["0", "e"].includes(value);
  }

  export function isCauseOfDeath(value: any): value is Enums.CauseOfDeath {
    return typeof value === "string" && [].includes(value);
  }

  export function isCombatStyle(value: any): value is Enums.CombatStyle {
    return typeof value === "string" && ["e", "t", "i"].includes(value);
  }

  export function isSkill(value: any): value is Enums.Skill {
    return (
      typeof value === "string" &&
      ["i", "n", "r", "s", "a", "o"].includes(value)
    );
  }

  export function isGameAction(value: any): value is Enums.GameAction {
    return (
      typeof value === "string" &&
      [
        "isUserBlocked",
        "sendPrivateMessage",
        "addFriend",
        "removeFriend",
        "blockUser",
        "unblockUser",
        "openSocketConnection",
        "reset",
      ].includes(value)
    );
  }

  // --- Packet Type Guards ---
  export function isEntityPacket(
    value: any,
  ): value is PacketBases.EntityPacket {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.entityId === "number"
    );
  }

  export function isPositionPacket(
    value: any,
  ): value is PacketBases.PositionPacket {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.x === "number" &&
      typeof value.y === "number" &&
      typeof value.z === "number"
    );
  }

  export function isItemPacket(value: any): value is PacketBases.ItemPacket {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.itemId === "number"
    );
  }

  export function isInventoryPacket(
    value: any,
  ): value is PacketBases.InventoryPacket {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.slot === "number" &&
      typeof value.itemId === "number"
    );
  }

  // --- Generated Packet Type Guards ---
  export function isGame(value: any): value is GeneratedPackets.Game {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isGameStateUpdate(
    value: any,
  ): value is GeneratedPackets.GameStateUpdate {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isNPCMoveTo(value: any): value is GeneratedPackets.NPCMoveTo {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.entityId === "number" &&
      typeof value.x === "number" &&
      typeof value.y === "number" &&
      typeof value.z === "number"
    );
  }

  export function isInGameHourChanged(
    value: any,
  ): value is GeneratedPackets.InGameHourChanged {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isObtainedResource(
    value: any,
  ): value is GeneratedPackets.ObtainedResource {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isIEnteredChunk(
    value: any,
  ): value is GeneratedPackets.IEnteredChunk {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isEnteredIdleState(
    value: any,
  ): value is GeneratedPackets.EnteredIdleState {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isLoginFailed(
    value: any,
  ): value is GeneratedPackets.LoginFailed {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isLoggedIn(value: any): value is GeneratedPackets.LoggedIn {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined &&
      value.param4 !== undefined &&
      value.param5 !== undefined
    );
  }

  export function isLogout(value: any): value is GeneratedPackets.Logout {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isLogoutFailed(
    value: any,
  ): value is GeneratedPackets.LogoutFailed {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isLoggedOut(value: any): value is GeneratedPackets.LoggedOut {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isStartedBanking(
    value: any,
  ): value is GeneratedPackets.StartedBanking {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isStoppedBanking(
    value: any,
  ): value is GeneratedPackets.StoppedBanking {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isReceivedBankitems(
    value: any,
  ): value is GeneratedPackets.ReceivedBankitems {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isTradeRequested(
    value: any,
  ): value is GeneratedPackets.TradeRequested {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isPlayerAccepted(
    value: any,
  ): value is GeneratedPackets.PlayerAccepted {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.entityId === "number"
    );
  }

  export function isTradeStarted(
    value: any,
  ): value is GeneratedPackets.TradeStarted {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isTradeCancelled(
    value: any,
  ): value is GeneratedPackets.TradeCancelled {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined
    );
  }

  export function isTradeCompleted(
    value: any,
  ): value is GeneratedPackets.TradeCompleted {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined
    );
  }

  export function isCreatedItem(
    value: any,
  ): value is GeneratedPackets.CreatedItem {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.itemId === "number"
    );
  }

  export function isStartedTargeting(
    value: any,
  ): value is GeneratedPackets.StartedTargeting {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined &&
      value.param4 !== undefined
    );
  }

  export function isStoppedTargeting(
    value: any,
  ): value is GeneratedPackets.StoppedTargeting {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isStartedSkilling(
    value: any,
  ): value is GeneratedPackets.StartedSkilling {
    return (
      typeof value === "object" && value !== null && isSkill(value.skillType)
    );
  }

  export function isStoppedSkilling(
    value: any,
  ): value is GeneratedPackets.StoppedSkilling {
    return (
      typeof value === "object" && value !== null && isSkill(value.skillType)
    );
  }

  export function isPlayerSkillLevelIncreased(
    value: any,
  ): value is GeneratedPackets.PlayerSkillLevelIncreased {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.entityId === "number" &&
      isSkill(value.skillType)
    );
  }

  export function isPlayerCombatLevelIncreased(
    value: any,
  ): value is GeneratedPackets.PlayerCombatLevelIncreased {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.entityId === "number"
    );
  }

  export function isCookedItem(
    value: any,
  ): value is GeneratedPackets.CookedItem {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.itemId === "number"
    );
  }

  export function isOvercookedItem(
    value: any,
  ): value is GeneratedPackets.OvercookedItem {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.itemId === "number"
    );
  }

  export function isIncreasedCombatExp(
    value: any,
  ): value is GeneratedPackets.IncreasedCombatExp {
    return (
      typeof value === "object" &&
      value !== null &&
      isSkill(value.skillType) &&
      typeof value.expAmount === "number"
    );
  }

  export function isChangeCombatStyle(
    value: any,
  ): value is GeneratedPackets.ChangeCombatStyle {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isCombatStyleChanged(
    value: any,
  ): value is GeneratedPackets.CombatStyleChanged {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isChangeAutoRetaliate(
    value: any,
  ): value is GeneratedPackets.ChangeAutoRetaliate {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isAutoRetaliateChanged(
    value: any,
  ): value is GeneratedPackets.AutoRetaliateChanged {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isStartedShopping(
    value: any,
  ): value is GeneratedPackets.StartedShopping {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined
    );
  }

  export function isStoppedShopping(
    value: any,
  ): value is GeneratedPackets.StoppedShopping {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isUpdatedShopStock(
    value: any,
  ): value is GeneratedPackets.UpdatedShopStock {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isStartedChangingAppearance(
    value: any,
  ): value is GeneratedPackets.StartedChangingAppearance {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isStoppedChangingAppearance(
    value: any,
  ): value is GeneratedPackets.StoppedChangingAppearance {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isChangeAppearance(
    value: any,
  ): value is GeneratedPackets.ChangeAppearance {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined &&
      value.param4 !== undefined &&
      value.param5 !== undefined
    );
  }

  export function isChangedAppearance(
    value: any,
  ): value is GeneratedPackets.ChangedAppearance {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined &&
      value.param4 !== undefined &&
      value.param5 !== undefined
    );
  }

  export function isMenuStateKeepAlivePing(
    value: any,
  ): value is GeneratedPackets.MenuStateKeepAlivePing {
    return (
      typeof value === "object" && value !== null && isMenuType(value.menuType)
    );
  }

  export function isToggleSprint(
    value: any,
  ): value is GeneratedPackets.ToggleSprint {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isToggledSprint(
    value: any,
  ): value is GeneratedPackets.ToggledSprint {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined
    );
  }

  export function isRestoredStats(
    value: any,
  ): value is GeneratedPackets.RestoredStats {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isEntityExhaustedResources(
    value: any,
  ): value is GeneratedPackets.EntityExhaustedResources {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.entityId === "number"
    );
  }

  export function isEntityReplenishedResources(
    value: any,
  ): value is GeneratedPackets.EntityReplenishedResources {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.entityId === "number"
    );
  }

  export function isShookTree(value: any): value is GeneratedPackets.ShookTree {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined
    );
  }

  export function isGainedExp(value: any): value is GeneratedPackets.GainedExp {
    return (
      typeof value === "object" &&
      value !== null &&
      isSkill(value.skillType) &&
      typeof value.expAmount === "number"
    );
  }

  export function isShakeTreeResultMessage(
    value: any,
  ): value is GeneratedPackets.ShakeTreeResultMessage {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.message === "string" &&
      typeof value.senderId === "number"
    );
  }

  export function isOpenedSkillingMenu(
    value: any,
  ): value is GeneratedPackets.OpenedSkillingMenu {
    return (
      typeof value === "object" &&
      value !== null &&
      isSkill(value.skillType) &&
      isMenuType(value.menuType)
    );
  }

  export function isUsedItemOnItem(
    value: any,
  ): value is GeneratedPackets.UsedItemOnItem {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.itemId === "number"
    );
  }

  export function isWentThroughDoor(
    value: any,
  ): value is GeneratedPackets.WentThroughDoor {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isCastTeleportSpell(
    value: any,
  ): value is GeneratedPackets.CastTeleportSpell {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.x === "number" &&
      typeof value.y === "number" &&
      typeof value.z === "number"
    );
  }

  export function isCastedTeleportSpell(
    value: any,
  ): value is GeneratedPackets.CastedTeleportSpell {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.x === "number" &&
      typeof value.y === "number" &&
      typeof value.z === "number"
    );
  }

  export function isCastInventorySpell(
    value: any,
  ): value is GeneratedPackets.CastInventorySpell {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined &&
      value.param4 !== undefined &&
      value.param5 !== undefined
    );
  }

  export function isCastedInventorySpell(
    value: any,
  ): value is GeneratedPackets.CastedInventorySpell {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined &&
      value.param4 !== undefined
    );
  }

  export function isCastSingleCombatOrStatusSpell(
    value: any,
  ): value is GeneratedPackets.CastSingleCombatOrStatusSpell {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined
    );
  }

  export function isCastedSingleCombatOrStatusSpell(
    value: any,
  ): value is GeneratedPackets.CastedSingleCombatOrStatusSpell {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined &&
      value.param4 !== undefined &&
      value.param5 !== undefined
    );
  }

  export function isToggleAutoCast(
    value: any,
  ): value is GeneratedPackets.ToggleAutoCast {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isToggledAutoCast(
    value: any,
  ): value is GeneratedPackets.ToggledAutoCast {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isSkillCurrentLevelChanged(
    value: any,
  ): value is GeneratedPackets.SkillCurrentLevelChanged {
    return (
      typeof value === "object" && value !== null && isSkill(value.skillType)
    );
  }

  export function isServerInfoMessage(
    value: any,
  ): value is GeneratedPackets.ServerInfoMessage {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.message === "string" &&
      typeof value.senderId === "number"
    );
  }

  export function isForcePublicMessage(
    value: any,
  ): value is GeneratedPackets.ForcePublicMessage {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.message === "string" &&
      typeof value.senderId === "number"
    );
  }

  export function isQuestProgressed(
    value: any,
  ): value is GeneratedPackets.QuestProgressed {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isCreatedUseItemOnItemItemsAction(
    value: any,
  ): value is GeneratedPackets.CreatedUseItemOnItemItemsAction {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.itemId === "number"
    );
  }

  export function isPathfindingFailed(
    value: any,
  ): value is GeneratedPackets.PathfindingFailed {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isFiredProjectile(
    value: any,
  ): value is GeneratedPackets.FiredProjectile {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined &&
      value.param4 !== undefined &&
      value.param5 !== undefined
    );
  }

  export function isServerShutdownCountdown(
    value: any,
  ): value is GeneratedPackets.ServerShutdownCountdown {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isReconnectToServer(
    value: any,
  ): value is GeneratedPackets.ReconnectToServer {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isEntityStunned(
    value: any,
  ): value is GeneratedPackets.EntityStunned {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.entityId === "number"
    );
  }

  export function isGlobalPublicMessage(
    value: any,
  ): value is GeneratedPackets.GlobalPublicMessage {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.message === "string" &&
      typeof value.senderId === "number"
    );
  }

  export function isHealthRestored(
    value: any,
  ): value is GeneratedPackets.HealthRestored {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined
    );
  }

  export function isPlayerCountChanged(
    value: any,
  ): value is GeneratedPackets.PlayerCountChanged {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.entityId === "number"
    );
  }

  export function isForcedSkillCurrentLevelChanged(
    value: any,
  ): value is GeneratedPackets.ForcedSkillCurrentLevelChanged {
    return (
      typeof value === "object" && value !== null && isSkill(value.skillType)
    );
  }

  export function isEndedNPCConversation(
    value: any,
  ): value is GeneratedPackets.EndedNPCConversation {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.entityId === "number"
    );
  }

  export function isInvokedInventoryItemAction(
    value: any,
  ): value is GeneratedPackets.InvokedInventoryItemAction {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.itemId === "number"
    );
  }

  export function isUsedItemOnEntity(
    value: any,
  ): value is GeneratedPackets.UsedItemOnEntity {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.entityId === "number" &&
      typeof value.itemId === "number"
    );
  }

  export function isInsertAtBankStorageSlot(
    value: any,
  ): value is GeneratedPackets.InsertAtBankStorageSlot {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isInsertedAtBankStorageSlot(
    value: any,
  ): value is GeneratedPackets.InsertedAtBankStorageSlot {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isRemovedItemAtInventorySlot(
    value: any,
  ): value is GeneratedPackets.RemovedItemAtInventorySlot {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.itemId === "number"
    );
  }

  export function isAddedItemAtInventorySlot(
    value: any,
  ): value is GeneratedPackets.AddedItemAtInventorySlot {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.itemId === "number"
    );
  }

  export function isShowLootMenu(
    value: any,
  ): value is GeneratedPackets.ShowLootMenu {
    return (
      typeof value === "object" && value !== null && isMenuType(value.menuType)
    );
  }

  export function isReorganizedInventorySlots(
    value: any,
  ): value is GeneratedPackets.ReorganizedInventorySlots {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined &&
      value.param4 !== undefined &&
      value.param5 !== undefined
    );
  }

  export function isUpdateTradeStatus(
    value: any,
  ): value is GeneratedPackets.UpdateTradeStatus {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isStartedDigging(
    value: any,
  ): value is GeneratedPackets.StartedDigging {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isStoppedDigging(
    value: any,
  ): value is GeneratedPackets.StoppedDigging {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isPlayerInfo(
    value: any,
  ): value is GeneratedPackets.PlayerInfo {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.entityId === "number"
    );
  }

  export function isCaptchaAction(
    value: any,
  ): value is GeneratedPackets.CaptchaAction {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined
    );
  }

  export function isOpenedCaptchaScreen(
    value: any,
  ): value is GeneratedPackets.OpenedCaptchaScreen {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isReceivedCaptcha(
    value: any,
  ): value is GeneratedPackets.ReceivedCaptcha {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined
    );
  }

  export function isCaptchaResultAction(
    value: any,
  ): value is GeneratedPackets.CaptchaResultAction {
    return (
      typeof value === "object" && value !== null && value.param1 !== undefined
    );
  }

  export function isMentalClarityChanged(
    value: any,
  ): value is GeneratedPackets.MentalClarityChanged {
    return (
      typeof value === "object" &&
      value !== null &&
      value.param1 !== undefined &&
      value.param2 !== undefined &&
      value.param3 !== undefined
    );
  }

  // --- Generic Validation Helpers ---
  export function hasProperty<T>(
    obj: any,
    prop: string,
  ): obj is T & Record<string, any> {
    return typeof obj === "object" && obj !== null && prop in obj;
  }

  export function isObject(value: any): value is Record<string, any> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  export function isArrayOf<T>(
    value: any,
    guard: (item: any) => item is T,
  ): value is T[] {
    return Array.isArray(value) && value.every(guard);
  }
}
