// Import necessary modules and classes
import { v4 as uuidv4 } from 'uuid';
import { Rover } from './modules/rover/rover-control';
import { Obstacles } from './modules/rover/obstacles';
import { WebSocketClient } from './modules/network/websocket';
import { Messaging } from './modules/mission-control/Messaging';
import { MapDisplay } from './modules/ui/map';
import { CommandInput } from './modules/ui/input';
import { RoverReturn } from './modules/ui/rover-return';
import { Command } from './modules/rover/rover-types.interface';

/**
 * Ancienne version de l'application
 */
class RoverMissionApp {
  private roverControl: Rover;
  private obstacles: Obstacles;
  private mapDisplay: MapDisplay | null = null;
  private commandInput: CommandInput | null = null;
  private roverReturn: RoverReturn | null = null;
  private websocket: WebSocketClient;
  private messaging: Messaging;
  
  constructor() {
    console.log("Creating Rover Mission App...");
    
    // Initialize components that don't require DOM elements
    this.obstacles = new Obstacles();
    this.roverControl = new Rover(this.obstacles); // Pass obstacles service to rover control
    this.websocket = new WebSocketClient();
    this.messaging = new Messaging(this.websocket);
    
    // Initialize UI when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeUI());
    } else {
      this.initializeUI();
    }
  }
  
  private initializeUI(): void {
    // Create UI container
    this.createUIContainer();
    
    // Initialize UI components after container is created
    try {
      this.mapDisplay = new MapDisplay('map-container');
      this.commandInput = new CommandInput('input-container');
      this.roverReturn = new RoverReturn('output-container');
      
      // Initialize map with starting position
      this.updateMap();
      
      // Start the application
      this.start();
    } catch (error) {
      console.error("Error initializing UI components:", error);
    }
  }
  
  private createUIContainer(): void {
    const appContainer = document.createElement('div');
    appContainer.id = 'rover-mission-app';
    appContainer.style.cssText = `
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Courier New', monospace;
      color: #00ff00;
      background-color: #222;
    `;
    
    // Add title
    const title = document.createElement('h1');
    title.textContent = 'Mars Rover Mission Control';
    title.style.cssText = `
      text-align: center;
      color: #00ff00;
      border-bottom: 1px solid #444;
      padding-bottom: 10px;
    `;
    appContainer.appendChild(title);
    
    // Create containers for UI components
    const mapContainer = document.createElement('div');
    mapContainer.id = 'map-container';
    mapContainer.style.cssText = `margin-bottom: 20px;`;
    
    const outputContainer = document.createElement('div');
    outputContainer.id = 'output-container';
    outputContainer.style.cssText = `margin-bottom: 20px;`;
    
    const inputContainer = document.createElement('div');
    inputContainer.id = 'input-container';
    
    appContainer.appendChild(mapContainer);
    appContainer.appendChild(outputContainer);
    appContainer.appendChild(inputContainer);
    
    document.body.appendChild(appContainer);
  }
  
  private async start(): Promise<void> {
    console.log("Starting rover mission application...");
    // Connexion WebSocket via la méthode du module
    await this.websocket.connectToRover('ws://localhost:8081', this.roverReturn, this.roverControl);
    // Start command input loop
    this.startCommandLoop();
  }

  private startCommandLoop(): void {
    if (!this.commandInput) {
      console.error("Command input not initialized");
      return;
    }
    const processNextCommand = async () => {
      try {
        const placeholderCommand = await this.commandInput!.captureUserInput();
        const inputStr = placeholderCommand.parameters?.rawInput?.toString() || '';
        if (this.roverReturn) {
          this.roverReturn.handleRoverResponse(`\n📡 Received command sequence: ${inputStr}`);
        }
        const commands = this.commandInput!.parseCommands(inputStr);
        if (commands.length > 0) {
          await this.executeCommandSequence(commands);
        } else {
          if (this.roverReturn) {
            this.roverReturn.handleRoverResponse(`❌ No valid commands found in: ${inputStr}`);
          }
        }
      } catch (error) {
        console.error('Error processing command:', error);
      }
      setTimeout(processNextCommand, 0);
    };
    processNextCommand();
  }

  private async executeCommandSequence(commands: Command[]): Promise<void> {
    if (this.roverReturn && commands.length > 1) {
      this.roverReturn.handleRoverResponse(`Executing ${commands.length} commands sequentially`);
    }
    let obstacleEncountered = false;
    let batteryEmpty = false;
    let completedCommands = 0;
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      const result = await this.sendCommandSilently(command);
      if (result && result.batteryEmpty) {
        batteryEmpty = true;
        break;
      }
      if (result && result.obstacleDetected) {
        obstacleEncountered = true;
        break;
      }
      completedCommands++;
      if (i < commands.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    if (batteryEmpty && this.roverReturn) {
      this.roverReturn.sendStatusUpdateWithMessage(
        this.roverControl.getStatus(),
        `🔋 BATTERY EMPTY! Completed ${completedCommands}/${commands.length} commands. Use 'R' to recharge.`,
        true
      );
    } else if (obstacleEncountered && this.roverReturn) {
      this.roverReturn.sendStatusUpdateWithMessage(
        this.roverControl.getStatus({ obstacleDetected: true }),
        `⚠️ OBSTACLE DETECTED! Completed ${completedCommands}/${commands.length} commands before encountering obstacle.`,
        true
      );
    } else if (this.roverReturn) {
      this.roverReturn.sendStatusUpdateWithMessage(
        this.roverControl.getStatus(),
        `✅ All ${commands.length} commands executed successfully.`
      );
    }
  }

  private async sendCommandSilently(command: Command): Promise<any> {
    console.log(`Processing command: ${command.type}`);
    let result: any = null;
    try {
      switch (command.type) {
        case 'Z':
          result = this.roverControl.moveForward();
          break;
        case 'S':
          result = this.roverControl.moveBackward();
          break;
        case 'Q':
          result = this.roverControl.turnLeft();
          break;
        case 'D':
          result = this.roverControl.turnRight();
          break;
        case 'R':
          result = await this.roverControl.handleSolarCharging(this.roverReturn);
          break;
        case 'scan':
          this.obstacles.discoverAllObstacles();
          result = {
            obstacles: this.obstacles.scanObstacles(),
            message: 'Scan complete. Obstacles detected and mapped.'
          };
          if (this.mapDisplay) this.mapDisplay.updateFromRover(this.roverControl, this.obstacles);
          if (this.roverReturn) this.roverReturn.sendStatusUpdateWithMessage(
            this.roverControl.getStatus(),
            '🔍 Scan complete. Obstacles detected and mapped.'
          );
          break;
        case 'return':
          result = { message: 'Return command received. Planning route back to base.' };
          if (this.roverReturn) this.roverReturn.sendStatusUpdateWithMessage(
            this.roverControl.getStatus(),
            '🏠 Return command received. Planning route back to base.'
          );
          break;
        default:
          console.warn(`Unknown command type: ${command.type}`);
          return null;
      }
      if (this.mapDisplay) this.mapDisplay.updateFromRover(this.roverControl, this.obstacles);
      await this.messaging.sendCommandToRover(command);
      return result;
    } catch (error) {
      console.error(`Error executing command ${command.type}:`, error);
      return null;
    }
  }
  
  private updateMap(): void {
    if (!this.mapDisplay) return;
    
    const position = this.roverControl.getPosition();
    const orientation = this.roverControl.getOrientation();
    
    // Get only discovered obstacles
    const discoveredObstacles = this.obstacles.scanObstacles();
    
    this.mapDisplay.updateMap(position, discoveredObstacles, orientation);
  }
}

// Create and start the application
console.log("Initializing Rover Mission Control");
const app = new RoverMissionApp();

// Add to window for debugging purposes
(window as any).roverApp = app;