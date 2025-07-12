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
  WR: 'AtmosphereManager',
  FG: 'NetworkManager',
  PV: 'SkillManager',
  cR: 'TickManager',
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
              prop.key.type === 'Identifier' &&
              prop.value.type === 'NumericLiteral'
            ) {
              values[prop.key.name] = prop.value.value;
            }
          });
          enums[enumName] = values;
        }
      }
    },
  });

  return enums;
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

  const CLIENT_URL = 'https://highspell.com/js/client/client.51.js';
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const LOCAL_CLIENT_PATH = path.resolve(__dirname, '../client.js');

  if (!CLIENT_URL) {
    console.error('Error: CLIENT_URL is not set in scripts/generate-types.js');
    process.exit(1);
  }

  let clientCode;
  try {
    // Try to read the local copy first
    clientCode = await fs.readFile(LOCAL_CLIENT_PATH, 'utf-8');
    console.log('Using cached local client code.');
  } catch (error) {
    // If it doesn't exist, download it
    console.log(`Downloading client code from ${CLIENT_URL}...`);
    const compressedCode = await new Promise((resolve, reject) => {
      https
        .get(CLIENT_URL, (res) => {
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
        })
        .on('error', (err) => reject(err));
    });

    // Decompress the code
    clientCode = zlib.gunzipSync(compressedCode).toString('utf-8');

    // Save the decompressed code for next time
    await fs.writeFile(LOCAL_CLIENT_PATH, clientCode);
    console.log(`Client code cached locally at ${LOCAL_CLIENT_PATH}`);
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
    const enumJsPath = path.resolve(distDir, 'enums.js');
    await fs.writeFile(enumJsPath, enumJsContent);
    console.log(`Successfully generated enums.js at ${enumJsPath}`);

    const enumDtsPath = path.resolve(distDir, 'enums.d.ts');
    await fs.writeFile(enumDtsPath, enumDeclarations);
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
    const definitionsDtsPath = path.resolve(distDir, 'definitions.d.ts');
    await fs.writeFile(definitionsDtsPath, definitionsDtsContent);
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
    const mappingsJsPath = path.resolve(distDir, 'mappings.js');
    await fs.writeFile(mappingsJsPath, mappingsJsContent);
    console.log(`Successfully generated mappings.js at ${mappingsJsPath}`);

    const mappingsDtsContent = `// Auto-generated by generate-types.js\nexport declare const friendlyToMinified: Record<string, string>;\nexport declare const minifiedToFriendly: Record<string, string>;\n`;
    const mappingsDtsPath = path.resolve(distDir, 'mappings.d.ts');
    await fs.writeFile(mappingsDtsPath, mappingsDtsContent);
    console.log(`Successfully generated mappings.d.ts at ${mappingsDtsPath}`);

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
