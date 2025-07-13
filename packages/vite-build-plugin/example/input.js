/**
 * Example input file showing HighSpell SDK usage with friendly names
 * This code will be transformed by the Vite plugin to use minified names
 */

import { Core, Generated } from '@bgscrew/highspell-types';

// Basic Core manager access
const gameLoop = Core.GameLoop;
const inputManager = Core.InputManager;
const entityManager = Core.EntityManager;

// Generated manager access
const networkManager = Generated.Managers.NetworkManager.Instance;
const packetFactory = Generated.Managers.PacketFactory.Instance;

// Method calls on managers
function initializeGame() {
  gameLoop.start();
  inputManager.initialize();
  networkManager.connect();
}

// Complex usage patterns
class GameController {
  constructor() {
    this.loop = Core.GameLoop;
    this.network = Generated.Managers.NetworkManager.Instance;
  }

  start() {
    this.loop.start();
    this.network.connect();
  }

  handleInput() {
    const input = Core.InputManager.getInput();
    return input;
  }

  sendPacket(data) {
    const packet = Generated.Managers.PacketFactory.Instance.create(data);
    this.network.send(packet);
  }
}

// Export for use in other modules
export { GameController, initializeGame };
