/**
 * Auto-generated packet base interfaces for common patterns.
 * Do not edit manually - regenerate with npm run generate-types.
 */

export namespace PacketBases {
  export interface EntityPacket {
    entityId: number;
  }

  export interface PositionPacket {
    x: number;
    y: number;
    z: number;
  }

  export interface ItemPacket {
    itemId: number;
  }

  export interface InventoryPacket {
    slot: number;
    itemId: number;
    amount?: number;
  }

  export interface ChunkPacket extends EntityPacket, PositionPacket {}
}
