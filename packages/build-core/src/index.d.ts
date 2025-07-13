/**
 * Core transformation logic shared across all HighSpell build plugins.
 * This module provides the common functionality for transforming friendly names
 * to minified names in different build tools.
 */

export interface TransformationInfo {
  type: 'core-manager' | 'generated-manager';
  friendlyName: string;
  minifiedName: string;
  shouldAddInstance: boolean;
}

export interface TransformationData {
  friendlyToMinified: Record<string, string>;
  patterns: {
    CORE_MEMBER: string;
    GENERATED_MANAGERS: string;
    IMPORT: string;
  };
  availableManagers: string[];
}

/**
 * Checks if a node represents a Core.ManagerName pattern
 */
export function isCoreManagerAccess(node: any): TransformationInfo | null;

/**
 * Checks if a node represents a Generated.Managers.ManagerName pattern
 */
export function isGeneratedManagerAccess(node: any): TransformationInfo | null;

/**
 * Checks if an import should be removed
 */
export function shouldRemoveImport(source: string): boolean;

/**
 * Creates a Game.minifiedName.Instance structure for different AST builders
 */
export function createGameManagerAccess(
  createIdentifier: (name: string) => any,
  createMemberExpression: (object: any, property: any) => any,
  minifiedName: string,
  addInstance?: boolean
): any;

/**
 * Generic transformation function that can be used by different build tools
 */
export function transformHighSpellNode(
  node: any,
  createIdentifier: (name: string) => any,
  createMemberExpression: (object: any, property: any) => any
): any | null;

/**
 * Get all available transformations for debugging/logging
 */
export function getTransformationInfo(): TransformationData;

export const TRANSFORM_PATTERNS: {
  CORE_MEMBER: string;
  GENERATED_MANAGERS: string;
  IMPORT: string;
};
