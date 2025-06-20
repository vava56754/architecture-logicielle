// Import necessary modules and classes
import { v4 as uuidv4 } from 'uuid';
import { RoverControl } from './modules/rover/rover-control';
import { Obstacles } from './modules/rover/obstacles';
import { WebSocketClient } from './modules/network/websocket';
import { Messaging } from './modules/mission-control/Messaging';
import { MapDisplay } from './modules/ui/map';
import { CommandInput } from './modules/ui/input';
import { RoverReturn } from './modules/ui/rover-return';
import { Command, RoverStatus, Position } from './modules/rover/rover-types.interface';

class RoverMissionApp {
  private roverControl: RoverControl;
  private obstacles: Obstacles;
  private mapDisplay: MapDisplay | null = null;
  private commandInput: CommandInput | null = null;
  private roverReturn: RoverReturn | null = null;
  private websocket: WebSocketClient;
  private messaging: Messaging;
  
  constructor() {
    console.log("Creating Rover Mission App...");
    
    // Initialize components that don't require DOM elements
    this.roverControl = new RoverControl();
    this.obstacles = new Obstacles();
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
    
    // Simulate WebSocket connection
    this.simulateWebSocketConnection();
    
    // Start command input loop
    this.startCommandLoop();
  }
  
  private startCommandLoop(): void {
    if (!this.commandInput) {
      console.error("Command input not initialized");
      return;
    }
    
    // Use recursive function instead of while loop to avoid blocking
    const processNextCommand = async () => {
      try {
        const command = await this.commandInput!.captureUserInput();
        await this.sendCommand(command);
      } catch (error) {
        console.error('Error processing command:', error);
      }
      
      // Continue listening for next command
      setTimeout(processNextCommand, 0);
    };
    
    // Start the command processing loop
    processNextCommand();
  }
  
  private async sendCommand(command: Command): Promise<void> {
    console.log(`Processing command: ${command.type}`);
    
    // Handle command locally (simulation)
    this.handleCommandLocally(command);
    
    try {
      // Send command to rover via messaging
      await this.messaging.sendCommandToRover(command);
    } catch (error) {
      console.error("Error sending command to rover:", error);
      if (this.roverReturn) {
        const errorMessage = (error && typeof error === 'object' && 'message' in error) ? (error as any).message : 'Unknown error';
        this.roverReturn.handleRoverResponse({
          error: true,
          message: `Failed to send command: ${errorMessage}`
        });
      }
    }
  }
  
  private handleCommandLocally(command: Command): void {
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
        case 'scan':
          result = {
            obstacles: this.obstacles.scanObstacles(),
            message: 'Scan complete. Obstacles detected and mapped.'
          };
          break;
        case 'return':
          // Simplified implementation - just report receiving the command
          result = {
            message: 'Return command received. Planning route back to base.'
          };
          break;
        default:
          console.warn(`Unknown command type: ${command.type}`);
          return;
      }
      
      // Update map with new position
      this.updateMap();
      
      // Generate rover response
      this.simulateRoverResponse(command, result);
    } catch (error) {
      console.error(`Error executing command ${command.type}:`, error);
      if (this.roverReturn) {
        const errorMessage = (error && typeof error === 'object' && 'message' in error) ? (error as any).message : 'Unknown error';
        this.roverReturn.handleRoverResponse({
          error: true,
          message: `Command execution failed: ${errorMessage}`
        });
      }
    }
  }
  
  private updateMap(): void {
    if (!this.mapDisplay) return;
    
    try {
      const position = this.roverControl.getPosition();
      const orientation = this.roverControl.getOrientation();
      const obstacles = this.obstacles.scanObstacles();
      
      this.mapDisplay.updateMap(position, obstacles, orientation);
    } catch (error) {
      console.error("Error updating map:", error);
    }
  }
  
  private simulateRoverResponse(command: Command, result: any): void {
    if (!this.roverReturn) return;
    
    setTimeout(() => {
      try {
        // Generate status update
        const status: RoverStatus = {
          position: this.roverControl.getPosition(),
          orientation: this.roverControl.getOrientation(),
          battery: 85, // Simulated battery level
          health: 'healthy',
          mission: 'Exploration',
          lastUpdate: new Date(),
          speed: 0.5,
          sensors: {
            camera: true,
            lidar: true,
            thermometer: true
          }
        };
        
        // Create response
        const response = {
          id: uuidv4(),
          status: status,
          message: `Command '${command.type}' executed successfully.`,
          result: result
        };
        
        // Send response to UI
        if (this.roverReturn) {
          this.roverReturn.handleRoverResponse(response);
        }
      } catch (error) {
        console.error("Error generating rover response:", error);
      }
    }, 500); // Simulate response delay
  }
  
  private simulateWebSocketConnection(): void {
    if (!this.roverReturn) return;
    
    // Simulate a successful connection
    setTimeout(() => {
      if (this.roverReturn) {
        this.roverReturn.handleRoverResponse('Connection established with rover.');
      }
      
      // Send initial status
      const initialStatus: RoverStatus = {
        position: { x: 0, y: 0, z: 0 },
        orientation: { orientation: 'N' },
        battery: 100,
        health: 'healthy',
        mission: 'Exploration',
        lastUpdate: new Date(),
        speed: 0,
        sensors: {
          camera: true,
          lidar: true,
          thermometer: true
        }
      };
      if (this.roverReturn) {
        this.roverReturn.updateRoverStatus(initialStatus);
      }
    }, 1000);
  }
}

// Create and start the application
console.log("Initializing Rover Mission Control");
const app = new RoverMissionApp();

// Add to window for debugging purposes
(window as any).roverApp = app;
