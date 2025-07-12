/**
 * This file contains manually-defined interfaces for network packets.
 */
export namespace Packets {
  export interface PublicMessage {
    entityId: number;
    message: string;
    isGlobal: boolean;
  }

  export interface PlayerMove {
    x: number;
    y: number;
    z: number;
  }

  export interface Login {
    username: string;
    password: string;
    someFlag: boolean;
  }

  export interface EquipItem {
    itemDefId: number;
    inventorySlot: number;
  }

  export interface UnequipItem {
    itemDefId: number;
    equipmentSlot: number;
  }

  export interface ShowDamage {
    entityId: number;
    damageAmount: number;
    damageType: Enums.DamageType; // Enum
  }

  export interface PlayerDied {
    entityId: number;
    causeOfDeath: Enums.CauseOfDeath; // Enum
  }

  export interface PlayerEnteredChunk {
    entityId: number;
    name: string;
    x: number;
    y: number;
    z: number;
    combatLevel: number;
    isMale: boolean;
    hairStyle: number;
    hairColor: number;
    skinColor: number;
    bodyType: number;
    equippedItems: number[];
    isSprinting: boolean;
    isInCombat: boolean;
  }

  export interface NPCEnteredChunk {
    entityId: number;
    npcId: number;
    x: number;
    y: number;
    z: number;
    health: number;
    maxHealth: number;
    isMoving: boolean;
  }

  export interface ItemEnteredChunk {
    entityId: number;
    itemId: number;
    x: number;
    y: number;
    z: number;
    quantity: number;
    isTradeable: boolean;
  }

  export interface EntityExitedChunk {
    entityId: number;
    entityType: Enums.EntityType;
  }

  export interface TeleportTo {
    entityId: number;
    x: number;
    y: number;
    z: number;
    mapLevel: number;
    someBoolean: boolean;
    someString: string;
  }

  export interface PerformActionOnEntity {
    targetAction: Enums.TargetAction;
    entityType: Enums.EntityType;
    entityId: number;
  }

  export interface UseItemOnEntity {
    itemId: number;
    entityType: Enums.EntityType;
    entityId: number;
  }

  export interface SendMovementPath {
    x: number;
    y: number;
  }

  export interface CreateItem {
    itemId: number;
    amount: number;
    menuType: Enums.MenuType;
  }

  export interface UseItemOnItem {
    menuType: Enums.MenuType;
    usingItemSlot: number;
    usingItemId: number;
    usingItemIsIou: boolean;
    targetItemSlot: number;
    targetItemId: number;
    targetItemIsIou: boolean;
    itemOnItemActionResultIndex: number;
    amountToCreate: number;
  }

  export interface InvokeInventoryItemAction {
    action: Enums.ItemAction;
    menuType: Enums.MenuType;
    slot: number;
    itemId: number;
    amount: number;
    isIou: boolean;
  }

  export interface ReorganizeInventorySlots {
    menu: Enums.MenuType;
    slot1: number;
    itemId1: number;
    isIou1: boolean;
    slot2: number;
    itemId2: number;
    isIou2: boolean;
    type: Enums.ReorganizeType;
  }
}
