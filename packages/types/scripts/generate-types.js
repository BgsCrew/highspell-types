// @ts-nocheck
import { promises as fs } from 'fs';
import path from 'path';
import https from 'https';
import zlib from 'zlib';
import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
import prettier from 'prettier';

const traverse = _traverse.default;

/**
 * A map of minified names to our descriptive, developer-friendly names.
 */
const nameMappings = {
  pW: 'GameLoop',
  gW: 'GameEngine',
  fW: 'InputManager',
  _W: 'WildernessManager',
  Lk: 'EntityManager',
  Xk: 'SpellManager',
  IF: 'WorldManager',
  FG: 'NetworkManager',
  dW: 'SpellActionManager',
  yV: 'PacketFactory',
  oq: 'UIManager',
  aD: 'WorldEntityManger',
  CN: 'GroundItemManager',
  vF: 'MeshManager',
  Dk: 'EntityFactory',
  Ck: 'AppearanceManager',
  qV: 'InventoryManager',
  lG: 'QuestManager',
  uG: 'ProjectileManager',
  DG: 'ChatFilterManager',
  jG: 'SocialManager',
  AV: 'PlayerStatsManager',
  SR: 'ObjectUrlManager',
  zR: 'FogManager',
  hF: 'CacheManager',
  hk: 'BitmapManager',
  jM: 'UnknownManager_jM',
};

/**
 * A map of PacketFactory method names to their manually-defined return types.
 * This is the core of the "prettifying" process.
 */
const packetMappings = {
  createPublicMessageAction: 'Packets.PublicMessage',
  createPlayerMoveToAction: 'Packets.PlayerMove',
  createLoginAction: 'Packets.Login',
  createEquippedItemAction: 'Packets.EquipItem',
  createUnequippedItemAction: 'Packets.UnequipItem',
  createShowDamageAction: 'Packets.ShowDamage',
  createPlayerDiedAction: 'Packets.PlayerDied',
  createPlayerEnteredChunkAction: 'Packets.PlayerEnteredChunk',
  createNPCEnteredChunkAction: 'Packets.NPCEnteredChunk',
  createItemEnteredChunkAction: 'Packets.ItemEnteredChunk',
  createEntityExitedChunkAction: 'Packets.EntityExitedChunk',
  createTeleportToAction: 'Packets.TeleportTo',
  createPerformActionOnEntityAction: 'Packets.PerformActionOnEntity',
  createUseItemOnEntityAction: 'Packets.UseItemOnEntity',
  createSendMovementPathAction: 'Packets.SendMovementPath',
  createCreateItemAction: 'Packets.CreateItem',
  createUseItemOnItemAction: 'Packets.UseItemOnItem',
  createInvokeInventoryItemActionAction: 'Packets.InvokeInventoryItemAction',
  createReorganizeInventorySlotsAction: 'Packets.ReorganizeInventorySlots',
};

const enumMappings = {
  n: 'EntityType',
  e: 'TargetAction',
  t: 'MenuType',
  i: 'ItemAction',
  o: 'ReorganizeType',
  r: 'CombatStyle',
  s: 'DamageType',
  a: 'CauseOfDeath',
  l: 'Skill',
};

const definitionMappings = {
  Y: 'ItemDefinition',
  Z: 'NPCDefinition',
  J: 'QuestDefinition',
};

/**
 * Extracts all enum-like objects from the AST.
 * @param {import('@babel/types').Node} ast - The AST of the client code.
 * @returns {object} A map of enum names to their values.
 */
function extractEnums(ast) {
  const enums = {};

  traverse(ast, {
    VariableDeclarator(path) {
      if (
        path.node.id.type === 'Identifier' &&
        path.node.init &&
        path.node.init.type === 'ObjectExpression'
      ) {
        const enumName = enumMappings[path.node.id.name];
        if (enumName) {
          const values = {};
          path.node.init.properties.forEach((prop) => {
            if (
              prop.type === 'ObjectProperty' &&
              prop.key.type === 'Identifier'
            ) {
              // Handle numeric literals
              if (prop.value.type === 'NumericLiteral') {
                values[prop.key.name] = prop.value.value;
              }
              // Handle string literals
              else if (prop.value.type === 'StringLiteral') {
                values[prop.key.name] = prop.value.value;
              }
              // Handle computed strings (e.g., 'attack')
              else if (prop.value.type === 'Identifier') {
                values[prop.key.name] = prop.value.name;
              }
            }
          });
          enums[enumName] = values;
        }
      }
    },
  });

  // Try to find additional enum patterns by looking for objects with sequential numeric values
  traverse(ast, {
    ObjectExpression(path) {
      const props = path.node.properties;
      if (props.length >= 3) {
        // Must have at least 3 properties to be considered an enum
        const values = {};
        let isValidEnum = true;
        let hasSequentialNumbers = true;
        let expectedValue = 0;

        for (const prop of props) {
          if (
            prop.type === 'ObjectProperty' &&
            prop.key.type === 'Identifier'
          ) {
            if (prop.value.type === 'NumericLiteral') {
              values[prop.key.name] = prop.value.value;
              if (prop.value.value !== expectedValue) {
                hasSequentialNumbers = false;
              }
              expectedValue++;
            } else if (prop.value.type === 'StringLiteral') {
              values[prop.key.name] = prop.value.value;
              hasSequentialNumbers = false;
            } else {
              isValidEnum = false;
              break;
            }
          } else {
            isValidEnum = false;
            break;
          }
        }

        // If this looks like an enum but isn't mapped, try to guess its purpose
        if (
          isValidEnum &&
          (hasSequentialNumbers || Object.keys(values).length >= 5)
        ) {
          // Check if this might be EntityType (common pattern: environment, item, npc, player)
          if (!enums.EntityType && Object.keys(values).length >= 3) {
            const keys = Object.keys(values).map((k) => k.toLowerCase());
            if (
              keys.includes('environment') ||
              keys.includes('item') ||
              keys.includes('npc') ||
              keys.includes('player')
            ) {
              enums.EntityType = values;
              console.log('Auto-detected EntityType enum:', values);
            }
          }

          // Check if this might be TargetAction (action words)
          if (!enums.TargetAction && Object.keys(values).length >= 5) {
            const keys = Object.keys(values).map((k) => k.toLowerCase());
            if (
              keys.some(
                (k) =>
                  k.includes('attack') ||
                  k.includes('talk') ||
                  k.includes('pick') ||
                  k.includes('use')
              )
            ) {
              enums.TargetAction = values;
              console.log('Auto-detected TargetAction enum:', values);
            }
          }

          // Check if this might be MenuType (menu-related terms)
          if (!enums.MenuType && Object.keys(values).length >= 3) {
            const keys = Object.keys(values).map((k) => k.toLowerCase());
            if (
              keys.some(
                (k) =>
                  k.includes('bank') ||
                  k.includes('shop') ||
                  k.includes('inventory') ||
                  k.includes('trade')
              )
            ) {
              enums.MenuType = values;
              console.log('Auto-detected MenuType enum:', values);
            }
          }
        }
      }
    },
  });

  return enums;
}

/**
 * Generates TypeScript type guard functions for runtime type checking.
 * @param {object} enums - The enum definitions.
 * @param {object} packets - The packet definitions.
 * @returns {string} The type guard functions as TypeScript code.
 */
function generateTypeGuards(enums, packets) {
  let guardContent = `/**
 * Auto-generated type guard functions for runtime type checking.
 * Do not edit manually - regenerate with npm run generate-types.
 */

export namespace TypeGuards {
`;

  // Generate enum type guards
  guardContent += `  // --- Enum Type Guards ---\n`;
  for (const enumName in enums) {
    const enumValues = enums[enumName];
    const values = Object.values(enumValues);

    guardContent += `  export function is${enumName}(value: any): value is Enums.${enumName} {\n`;
    guardContent += `    return typeof value === 'string' && [${values.map((v) => `'${v}'`).join(', ')}].includes(value);\n`;
    guardContent += `  }\n\n`;
  }

  // Generate packet type guards based on common interfaces
  guardContent += `  // --- Packet Type Guards ---\n`;

  // Generate guards for base packet types
  guardContent += `  export function isEntityPacket(value: any): value is PacketBases.EntityPacket {\n`;
  guardContent += `    return typeof value === 'object' && value !== null && typeof value.entityId === 'number';\n`;
  guardContent += `  }\n\n`;

  guardContent += `  export function isPositionPacket(value: any): value is PacketBases.PositionPacket {\n`;
  guardContent += `    return typeof value === 'object' && value !== null && \n`;
  guardContent += `           typeof value.x === 'number' && typeof value.y === 'number' && typeof value.z === 'number';\n`;
  guardContent += `  }\n\n`;

  guardContent += `  export function isItemPacket(value: any): value is PacketBases.ItemPacket {\n`;
  guardContent += `    return typeof value === 'object' && value !== null && typeof value.itemId === 'number';\n`;
  guardContent += `  }\n\n`;

  guardContent += `  export function isInventoryPacket(value: any): value is PacketBases.InventoryPacket {\n`;
  guardContent += `    return typeof value === 'object' && value !== null && \n`;
  guardContent += `           typeof value.slot === 'number' && typeof value.itemId === 'number';\n`;
  guardContent += `  }\n\n`;

  // Generate guards for generated packet interfaces
  if (packets && Object.keys(packets).length > 0) {
    guardContent += `  // --- Generated Packet Type Guards ---\n`;
    for (const [packetName, fields] of Object.entries(packets)) {
      guardContent += `  export function is${packetName}(value: any): value is GeneratedPackets.${packetName} {\n`;
      guardContent += `    return typeof value === 'object' && value !== null`;

      for (const field of fields) {
        if (field.type === 'number') {
          guardContent += ` && \n           typeof value.${field.name} === 'number'`;
        } else if (field.type === 'string') {
          guardContent += ` && \n           typeof value.${field.name} === 'string'`;
        } else if (field.type === 'boolean') {
          guardContent += ` && \n           typeof value.${field.name} === 'boolean'`;
        } else if (field.type.startsWith('Enums.')) {
          const enumName = field.type.replace('Enums.', '');
          guardContent += ` && \n           is${enumName}(value.${field.name})`;
        } else {
          guardContent += ` && \n           value.${field.name} !== undefined`;
        }
      }

      guardContent += `;\n  }\n\n`;
    }
  }

  // Generate generic object validation helper
  guardContent += `  // --- Generic Validation Helpers ---\n`;
  guardContent += `  export function hasProperty<T>(obj: any, prop: string): obj is T & Record<string, any> {\n`;
  guardContent += `    return typeof obj === 'object' && obj !== null && prop in obj;\n`;
  guardContent += `  }\n\n`;

  guardContent += `  export function isObject(value: any): value is Record<string, any> {\n`;
  guardContent += `    return typeof value === 'object' && value !== null && !Array.isArray(value);\n`;
  guardContent += `  }\n\n`;

  guardContent += `  export function isArrayOf<T>(value: any, guard: (item: any) => item is T): value is T[] {\n`;
  guardContent += `    return Array.isArray(value) && value.every(guard);\n`;
  guardContent += `  }\n`;

  guardContent += `}\n`;

  return guardContent;
}

/**
 * Generates packet interfaces from method naming patterns in PacketFactory.
 * @param {object} singletons - The collected singleton data.
 * @returns {object} A map of packet names to their field definitions.
 */
function generatePacketInterfacesFromPatterns(singletons) {
  const packets = {};

  // Find PacketFactory
  const packetFactory = Object.values(singletons).find(
    (singleton) => singleton.descriptiveName === 'PacketFactory'
  );

  if (!packetFactory) {
    return packets;
  }

  // Analyze methods to detect patterns
  packetFactory.methods.forEach((method) => {
    const methodName = method.name;

    // Skip methods that already have packet mappings
    if (packetMappings[methodName]) {
      return;
    }

    // Extract packet patterns based on method names
    if (methodName.startsWith('create') && methodName.endsWith('Action')) {
      const actionName = methodName.replace('create', '').replace('Action', '');

      // Generate packet interface based on parameter count and naming patterns
      const fields = [];
      const paramCount = method.params.length;

      // Common patterns based on action names
      if (
        actionName.includes('Entity') ||
        actionName.includes('Player') ||
        actionName.includes('NPC')
      ) {
        fields.push({ name: 'entityId', type: 'number' });
      }

      if (
        actionName.includes('Move') ||
        actionName.includes('Position') ||
        actionName.includes('Teleport')
      ) {
        fields.push(
          { name: 'x', type: 'number' },
          { name: 'y', type: 'number' },
          { name: 'z', type: 'number' }
        );
      }

      if (actionName.includes('Item')) {
        fields.push({ name: 'itemId', type: 'number' });
      }

      if (actionName.includes('Exp') || actionName.includes('Experience')) {
        fields.push(
          { name: 'skillType', type: 'Enums.Skill' },
          { name: 'expAmount', type: 'number' }
        );
      }

      if (actionName.includes('Message') || actionName.includes('Chat')) {
        fields.push(
          { name: 'message', type: 'string' },
          { name: 'senderId', type: 'number' }
        );
      }

      if (actionName.includes('Damage')) {
        fields.push(
          { name: 'entityId', type: 'number' },
          { name: 'damageAmount', type: 'number' },
          { name: 'damageType', type: 'Enums.DamageType' }
        );
      }

      if (actionName.includes('Skill')) {
        fields.push({ name: 'skillType', type: 'Enums.Skill' });
      }

      if (actionName.includes('Menu')) {
        fields.push({ name: 'menuType', type: 'Enums.MenuType' });
      }

      // Add generic parameters based on parameter count if we don't have specific fields
      if (fields.length === 0 && paramCount > 0) {
        for (let i = 0; i < Math.min(paramCount, 5); i++) {
          fields.push({ name: `param${i + 1}`, type: 'any' });
        }
      }

      // Only generate if we have some meaningful fields
      if (fields.length > 0) {
        packets[actionName] = fields;
      }
    }
  });

  return packets;
}

/**
 * Extracts all definition-like classes from the AST.
 * @param {import('@babel/types').Node} ast - The AST of the client code.
 * @returns {object} A map of definition names to their properties.
 */
function extractDefinitions(ast) {
  const definitions = {};

  traverse(ast, {
    ClassDeclaration(path) {
      const className = path.node.id ? path.node.id.name : null;
      if (!className) return;

      const definitionName = definitionMappings[className];
      if (definitionName) {
        /** @type {{name: string, type: string}[]} */
        const properties = [];
        path
          .get('body')
          .get('body')
          .forEach((member) => {
            if (member.isClassProperty()) {
              const propName = member.get('key').node.name;
              if (!propName.startsWith('_')) {
                const propType = inferType(member.get('value').node);
                properties.push({ name: propName, type: propType });
              }
            }
          });
        definitions[definitionName] = properties;
      }
    },
  });

  return definitions;
}

/**
 * Infers the TypeScript type from a Babel AST node.
 * @param {import('@babel/types').Node} node - The AST node.
 * @returns {string} The inferred TypeScript type.
 */
function inferType(node) {
  if (!node) return 'any';
  if (node.type === 'StringLiteral') return 'string';
  if (node.type === 'NumericLiteral') return 'number';
  if (node.type === 'BooleanLiteral') return 'boolean';
  if (node.type === 'NullLiteral') return 'null';
  if (node.type === 'NewExpression' && node.callee.name)
    return node.callee.name;
  if (node.type === 'ThisExpression') return 'this';
  return 'any';
}

/**
 * Generates the content for the game.d.ts file.
 * @param {object} singletons - The collected singleton data.
 * @returns {string} The content of the .d.ts file.
 */
function generateDtsContent(singletons) {
  // Base content now includes a reference to our manual packet definitions
  let dtsContent = `/// <reference types="@babylonjs/core" />\n/// <reference path="packets.d.ts" />\n/// <reference path="enums.d.ts" />\n/// <reference path="definitions.d.ts" />\n\n/**\n * This file is auto-generated by the reverse-engineering script.\n * Do not edit it manually.\n */\n\ndeclare module "game" {\n    export import BABYLON = BABYLON;\n\n    // Forward declaration for the Managers namespace\n    namespace Managers {}\n    \n    // We need to declare the Packets namespace so the generated code can reference it.\n    export * from './packets';\n\n`;

  dtsContent += `    namespace Managers {\n`;

  for (const className in singletons) {
    const singleton = singletons[className];
    dtsContent += `\n        /**\n         * Originally: ${className}\n         */\n        export class ${singleton.descriptiveName} {\n            static readonly Instance: ${singleton.descriptiveName};\n${singleton.properties.map((prop) => `            ${prop.name}: ${prop.type};`).join('\n')}\n${singleton.methods.map((method) => `            ${method.name}(${method.params.join(', ')}): ${method.returnType};`).join('\n')}\n        }\n`;
  }

  dtsContent += `    }\n}\n`;

  return dtsContent;
}

/**
 * Generates TypeScript enum declarations from a JSON object.
 * @param {object} enums - The object containing enum definitions.
 * @returns {string} The generated TypeScript enums as a string.
 */
function generateEnumDeclarations(enums) {
  let enumContent = '\n    // --- Custom Enums ---\n';
  for (const enumName in enums) {
    enumContent += `    export const enum ${enumName} {\n`;
    const enumValues = enums[enumName];
    for (const key in enumValues) {
      enumContent += `        ${key} = '${enumValues[key]}',\n`;
    }
    enumContent += `    }\n\n`;
  }
  return enumContent;
}

/**
 * The main entry point for the type generation script.
 */
async function main() {
  console.log('Starting TypeScript definition generation...');

  const useLocalClient = process.argv.includes('--local-client');
  const CLIENT_URL = 'https://highspell.com/js/client/client.51.js';
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const LOCAL_CLIENT_PATH = path.resolve(__dirname, '../client.js');

  if (!CLIENT_URL && !useLocalClient) {
    console.error(
      'Error: CLIENT_URL is not set and --local-client flag is not provided.'
    );
    process.exit(1);
  }

  /**
   * Downloads client code with retry logic, exponential backoff, and jitter.
   * @param {string} url - The URL to download from.
   * @param {number} maxRetries - Maximum number of retry attempts.
   * @returns {Promise<Buffer>} The downloaded content as a Buffer.
   */
  async function downloadWithRetry(url, maxRetries = 3) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `Downloading client code from ${url}... (attempt ${attempt + 1}/${
            maxRetries + 1
          })`
        );

        const compressedCode = await new Promise((resolve, reject) => {
          const request = https.get(url, { timeout: 30000 }, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
              return reject(
                new Error(
                  `Failed to download file: Status Code ${res.statusCode}`
                )
              );
            }
            /** @type {Buffer[]} */
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
          });

          request.on('error', (err) => reject(err));
          request.on('timeout', () => {
            request.destroy();
            reject(new Error('Request timeout'));
          });
        });

        return compressedCode;
      } catch (error) {
        console.warn(`Download attempt ${attempt + 1} failed:`, error.message);

        if (attempt === maxRetries) {
          throw new Error(
            `Failed to download after ${maxRetries + 1} attempts: ${
              error.message
            }`
          );
        }

        // Calculate delay with exponential backoff and jitter
        const baseDelay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        const jitter = Math.random() * 1000; // 0-1s random jitter
        const delay = baseDelay + jitter;

        console.log(`Retrying in ${Math.round(delay)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  let clientCode;
  if (useLocalClient) {
    try {
      clientCode = await fs.readFile(LOCAL_CLIENT_PATH, 'utf-8');
      console.log('Using local client code due to --local-client flag.');
    } catch (error) {
      console.error(
        `Error: --local-client flag was used, but failed to read local client file at ${LOCAL_CLIENT_PATH}`
      );
      console.error(error);
      process.exit(1);
    }
  } else {
    // First, try to download the latest version
    try {
      const compressedCode = await downloadWithRetry(CLIENT_URL, 3);

      // Decompress the code
      clientCode = zlib.gunzipSync(compressedCode).toString('utf-8');

      // Save the decompressed code for next time
      await fs.writeFile(LOCAL_CLIENT_PATH, clientCode);
      console.log(
        `Client code downloaded and cached locally at ${LOCAL_CLIENT_PATH}`
      );
    } catch (downloadError) {
      console.warn('Failed to download client code:', downloadError.message);
      console.log('Falling back to cached or included client.js file...');

      try {
        clientCode = await fs.readFile(LOCAL_CLIENT_PATH, 'utf-8');
        console.log('Successfully using fallback client.js file.');
      } catch (fallbackError) {
        console.error(
          'Error: Failed to download client code and no fallback file available.'
        );
        console.error('Download error:', downloadError.message);
        console.error('Fallback error:', fallbackError.message);
        process.exit(1);
      }
    }
  }

  try {
    console.log('First 500 characters of downloaded content:');
    console.log(clientCode.substring(0, 500));

    console.log('Parsing client code into AST...');
    const ast = parser.parse(clientCode, {
      sourceType: 'unambiguous',
      allowReturnOutsideFunction: true,
    });

    console.log(
      'AST parsing complete. Traversing AST to find all potential singletons...'
    );

    const allSingletons = new Set();
    const mappedSingletons = {};

    traverse(ast, {
      ClassDeclaration(path) {
        const className = path.node.id ? path.node.id.name : null;
        if (!className) return;

        const isSingleton = path
          .get('body')
          .get('body')
          .some(
            (member) =>
              member.isClassMethod({ kind: 'get', static: true }) &&
              member.get('key').isIdentifier({ name: 'Instance' })
          );

        if (isSingleton) {
          allSingletons.add(className);

          // Only process the class if it's in our manual mapping
          if (nameMappings[className]) {
            const descriptiveName =
              nameMappings[className] || `UnknownManager_${className}`;
            /** @type {{name: string, params: string[], returnType: string}[]} */
            const methods = [];
            /** @type {{name: string, type: string}[]} */
            const properties = [];

            path
              .get('body')
              .get('body')
              .forEach((member) => {
                if (member.isClassMethod({ kind: 'method' })) {
                  const methodName = member.get('key').node.name;
                  if (methodName.startsWith('_')) return;

                  const params = member.get('params').map((paramPath) => {
                    if (paramPath.isIdentifier()) {
                      return `${paramPath.node.name}: any`;
                    } else if (paramPath.isAssignmentPattern()) {
                      return `${paramPath.get('left').node.name}?: any`;
                    }
                    return 'param: any';
                  });

                  let returnType = packetMappings[methodName];
                  if (!returnType) {
                    member.get('body').traverse({
                      ReturnStatement(returnPath) {
                        const arg = returnPath.get('argument');
                        const inferred = inferType(arg.node);
                        returnType =
                          inferred === 'this' ? descriptiveName : inferred;
                      },
                    });
                  }
                  methods.push({
                    name: methodName,
                    params,
                    returnType: returnType || 'void',
                  });
                }
              });

            const constructor = path
              .get('body')
              .get('body')
              .find((member) => member.isClassMethod({ kind: 'constructor' }));
            if (constructor) {
              constructor
                .get('body')
                .get('body')
                .forEach((statement) => {
                  if (
                    statement.isExpressionStatement() &&
                    statement.get('expression').isAssignmentExpression()
                  ) {
                    const assignment = statement.get('expression');
                    const left = assignment.get('left');
                    if (
                      left.isMemberExpression() &&
                      left.get('object').isThisExpression()
                    ) {
                      const propName = left.get('property').node.name;
                      if (!propName.startsWith('_')) {
                        const propType = inferType(
                          assignment.get('right').node
                        );
                        properties.push({ name: propName, type: propType });
                      }
                    }
                  }
                });
            }

            mappedSingletons[className] = {
              descriptiveName,
              methods,
              properties: [
                ...new Map(
                  properties.map((item) => [item.name, item])
                ).values(),
              ],
            };
          }
        }
      },
    });

    console.log('Singleton analysis complete.');

    // --- Report unmapped singletons ---
    const unmappedSingletons = [...allSingletons].filter(
      (s) => !nameMappings[s]
    );

    if (unmappedSingletons.length > 0) {
      console.warn('==================================================');
      console.warn('WARNING: Found unmapped singleton classes!');
      console.warn(
        'Add these to the `nameMappings` object in `scripts/generate-types.js` to include them in the generated types.'
      );
      unmappedSingletons.forEach((s) => console.warn(`- ${s}`));
      console.warn('==================================================');
    } else {
      console.log('All found singletons are mapped. Great!');
    }

    console.log('Generating and formatting d.ts content...');
    let rawDtsContent = generateDtsContent(mappedSingletons);

    // --- Generate Enums ---
    console.log('Extracting and generating enums...');
    const allEnums = extractEnums(ast);

    // Auto-generate GameAction enum from SocialManager methods
    const socialManager = mappedSingletons['jG']; // Minified name for SocialManager
    if (socialManager) {
      const gameActionEnum = {};
      socialManager.methods.forEach((method) => {
        const enumKey =
          method.name.charAt(0).toUpperCase() + method.name.slice(1);
        gameActionEnum[enumKey] = method.name;
      });
      allEnums['GameAction'] = gameActionEnum;
    }

    const enumDeclarations = generateEnumDeclarations(allEnums);

    // Inject enums before the final closing brace of the module
    rawDtsContent = rawDtsContent.slice(0, -2) + enumDeclarations + '}\n';

    const formattedDtsContent = await prettier.format(rawDtsContent, {
      parser: 'typescript',
    });

    const distDir = path.resolve(__dirname, '../dist');
    await fs.mkdir(distDir, { recursive: true });

    // Generate a real JS file for the enums so they can be imported at runtime
    let enumJsContent = '// Auto-generated by generate-types.js\n';
    for (const enumName in allEnums) {
      enumJsContent += `export const ${enumName} = {\n`;
      const enumValues = allEnums[enumName];
      for (const key in enumValues) {
        enumJsContent += `    ${key}: '${enumValues[key]}',\n`;
      }
      enumJsContent += `};\n`;
    }
    const formattedEnumJsContent = await prettier.format(enumJsContent, {
      parser: 'babel',
    });
    const enumJsPath = path.resolve(distDir, 'enums.js');
    await fs.writeFile(enumJsPath, formattedEnumJsContent);
    console.log(`Successfully generated enums.js at ${enumJsPath}`);

    const formattedEnumDeclarations = await prettier.format(enumDeclarations, {
      parser: 'typescript',
    });
    const enumDtsPath = path.resolve(distDir, 'enums.d.ts');
    await fs.writeFile(enumDtsPath, formattedEnumDeclarations);
    console.log(`Successfully generated enums.d.ts at ${enumDtsPath}`);

    // --- Generate Definitions ---
    console.log('Extracting and generating definitions...');
    const allDefinitions = extractDefinitions(ast);
    let definitionsDtsContent = '// Auto-generated by generate-types.js\n';
    for (const defName in allDefinitions) {
      definitionsDtsContent += `export interface ${defName} {\n`;
      const properties = allDefinitions[defName];
      properties.forEach((prop) => {
        definitionsDtsContent += `    ${prop.name}: ${prop.type};\n`;
      });
      definitionsDtsContent += `}\n\n`;
    }
    const formattedDefinitionsDtsContent = await prettier.format(
      definitionsDtsContent,
      {
        parser: 'typescript',
      }
    );
    const definitionsDtsPath = path.resolve(distDir, 'definitions.d.ts');
    await fs.writeFile(definitionsDtsPath, formattedDefinitionsDtsContent);
    console.log(
      `Successfully generated definitions.d.ts at ${definitionsDtsPath}`
    );

    const reverseMappings = Object.fromEntries(
      Object.entries(nameMappings).map(([k, v]) => [v, k])
    );
    const mappingsJsContent = `// Auto-generated by generate-types.js\nexport const friendlyToMinified = ${JSON.stringify(
      reverseMappings,
      null,
      4
    )};\nexport const minifiedToFriendly = ${JSON.stringify(
      nameMappings,
      null,
      4
    )};\n`;
    const formattedMappingsJsContent = await prettier.format(
      mappingsJsContent,
      {
        parser: 'babel',
      }
    );
    const mappingsJsPath = path.resolve(distDir, 'mappings.js');
    await fs.writeFile(mappingsJsPath, formattedMappingsJsContent);
    console.log(`Successfully generated mappings.js at ${mappingsJsPath}`);

    const mappingsDtsContent = `// Auto-generated by generate-types.js\nexport declare const friendlyToMinified: Record<string, string>;\nexport declare const minifiedToFriendly: Record<string, string>;\n`;
    const formattedMappingsDtsContent = await prettier.format(
      mappingsDtsContent,
      {
        parser: 'typescript',
      }
    );
    const mappingsDtsPath = path.resolve(distDir, 'mappings.d.ts');
    await fs.writeFile(mappingsDtsPath, formattedMappingsDtsContent);
    console.log(`Successfully generated mappings.d.ts at ${mappingsDtsPath}`);

    // Generate CommonJS version for compatibility
    const mappingsCjsContent = `// Auto-generated by generate-types.js\n// CommonJS export wrapper for mappings\n// This allows CommonJS modules to require the mappings\nmodule.exports = {\n  friendlyToMinified: ${JSON.stringify(reverseMappings, null, 2)},\n  minifiedToFriendly: ${JSON.stringify(nameMappings, null, 2)}\n};\n`;
    const formattedMappingsCjsContent = await prettier.format(
      mappingsCjsContent,
      {
        parser: 'babel',
      }
    );
    const mappingsCjsPath = path.resolve(distDir, 'mappings.cjs');
    await fs.writeFile(mappingsCjsPath, formattedMappingsCjsContent);
    console.log(`Successfully generated mappings.cjs at ${mappingsCjsPath}`);

    // --- Generate Core Manager Exports ---
    console.log('Generating Core manager exports...');
    const coreExports = Object.values(nameMappings)
      .map(
        (friendlyName) =>
          `  export const ${friendlyName} = Generated.Managers.${friendlyName}.Instance;`
      )
      .join('\n');

    const coreExportsContent = `/// <reference path="generated.d.ts" />

/**
 * Auto-generated Core namespace exports.
 * Do not edit manually - regenerate with npm run generate-types.
 */

import * as Generated from './generated';

export namespace Core {
  // --- Auto-generated Manager Exports ---
${coreExports}
}

export default Core;
`;

    const formattedCoreExportsContent = await prettier.format(
      coreExportsContent,
      {
        parser: 'typescript',
      }
    );
    const coreExportsPath = path.resolve(__dirname, '../src/core-exports.d.ts');
    await fs.writeFile(coreExportsPath, formattedCoreExportsContent);
    console.log(
      `Successfully generated core-exports.d.ts at ${coreExportsPath}`
    );

    // --- Generate Packet Base Interfaces ---
    console.log('Generating packet base interfaces...');
    const packetBaseContent = `/**
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
`;

    const formattedPacketBaseContent = await prettier.format(
      packetBaseContent,
      {
        parser: 'typescript',
      }
    );
    const packetBasePath = path.resolve(__dirname, '../src/packet-bases.d.ts');
    await fs.writeFile(packetBasePath, formattedPacketBaseContent);
    console.log(
      `Successfully generated packet-bases.d.ts at ${packetBasePath}`
    );

    // --- Generate Additional Packet Interfaces from Patterns ---
    console.log('Generating packet interfaces from method patterns...');
    const additionalPackets =
      generatePacketInterfacesFromPatterns(mappedSingletons);
    if (Object.keys(additionalPackets).length > 0) {
      const additionalPacketsContent = `/**
 * Auto-generated packet interfaces from method naming patterns.
 * Do not edit manually - regenerate with npm run generate-types.
 */

export namespace GeneratedPackets {
${Object.entries(additionalPackets)
  .map(([name, fields]) => {
    const fieldDefs = fields
      .map((field) => `  ${field.name}: ${field.type};`)
      .join('\n');
    return `  export interface ${name} {\n${fieldDefs}\n  }`;
  })
  .join('\n\n')}
}
`;

      const formattedAdditionalPacketsContent = await prettier.format(
        additionalPacketsContent,
        {
          parser: 'typescript',
        }
      );
      const additionalPacketsPath = path.resolve(
        __dirname,
        '../src/generated-packets.d.ts'
      );
      await fs.writeFile(
        additionalPacketsPath,
        formattedAdditionalPacketsContent
      );
      console.log(
        `Successfully generated generated-packets.d.ts at ${additionalPacketsPath}`
      );
    }

    // --- Generate Type Guard Functions ---
    console.log('Generating type guard functions...');
    const typeGuardContent = generateTypeGuards(allEnums, additionalPackets);
    const formattedTypeGuardContent = await prettier.format(typeGuardContent, {
      parser: 'typescript',
    });
    const typeGuardPath = path.resolve(__dirname, '../src/type-guards.d.ts');
    await fs.writeFile(typeGuardPath, formattedTypeGuardContent);
    console.log(`Successfully generated type-guards.d.ts at ${typeGuardPath}`);

    const generatedDtsPath = path.resolve(distDir, 'generated.d.ts');
    await fs.writeFile(generatedDtsPath, formattedDtsContent);
    console.log(`Successfully generated generated.d.ts at ${generatedDtsPath}`);

    console.log('Copying manual type definitions to dist...');
    const srcDir = path.resolve(__dirname, '../src');
    const manualFiles = await fs.readdir(srcDir);
    for (const file of manualFiles) {
      const srcPath = path.resolve(srcDir, file);
      const destPath = path.resolve(distDir, file);
      await fs.copyFile(srcPath, destPath);
      console.log(`Copied ${file} to ${destPath}`);
    }

    console.log('Build process complete.');
  } catch (error) {
    console.error('An error occurred during type generation:', error);
    process.exit(1);
  }
}

main();
