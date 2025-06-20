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
    this.obstacles = new Obstacles();
    this.roverControl = new RoverControl(this.obstacles); // Pass obstacles service to rover control
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
    
    // Try to connect to real WebSocket server
    await this.connectToWebSocket();
    
    // Start command input loop
    this.startCommandLoop();
  }

  private async connectToWebSocket(): Promise<void> {
    if (!this.roverReturn) return;

    this.roverReturn.handleRoverResponse('Attempting to connect to rover...');
    
    const connected = await this.websocket.connect('ws://localhost:8081');
    
    if (connected) {
      this.roverReturn.handleRoverResponse('✅ Connected to rover WebSocket server');
      
      // Remove the response handler that was causing messages for each command
      // this.messaging.onResponse((response) => {
      //   if (this.roverReturn) {
      //     this.roverReturn.handleRoverResponse(`Rover confirmed: ${response.originalCommand} command executed`);
      //   }
      // });
      
      // Send initial status
      const initialStatus: RoverStatus = {
        position: { x: 0, y: 0, z: 0 },
        orientation: { orientation: 'N' },
        battery: this.roverControl.getBattery(),
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
      
      this.roverReturn.updateRoverStatus(initialStatus);
    } else {
      this.roverReturn.handleRoverResponse({
        error: true,
        message: '❌ Failed to connect to rover. Make sure WebSocket server is running on port 8081.'
      });
    }
  }

  private startCommandLoop(): void {
    if (!this.commandInput) {
      console.error("Command input not initialized");
      return;
    }
    
    // Use recursive function instead of while loop to avoid blocking
    const processNextCommand = async () => {
      try {
        // Get the input from the form
        const placeholderCommand = await this.commandInput!.captureUserInput();
        // Get the raw input string from parameters
        const inputStr = placeholderCommand.parameters?.rawInput?.toString() || '';
        
        if (this.roverReturn) {
          // Add some spacing before new command sequence
          this.roverReturn.handleRoverResponse(`\n📡 Received command sequence: ${inputStr}`);
        }
        
        // Parse all commands from the input string
        const commands = this.commandInput!.parseCommands(inputStr);
        
        if (commands.length > 0) {
          // Execute the sequence of commands
          await this.executeCommandSequence(commands);
        } else {
          if (this.roverReturn) {
            this.roverReturn.handleRoverResponse(`❌ No valid commands found in: ${inputStr}`);
          }
        }
      } catch (error) {
        console.error('Error processing command:', error);
      }
      
      // Continue listening for next command
      setTimeout(processNextCommand, 0);
    };
    
    // Start the command processing loop
    processNextCommand();
  }
  
  private async executeCommandSequence(commands: Command[]): Promise<void> {
    if (this.roverReturn && commands.length > 1) {
      this.roverReturn.handleRoverResponse(`Executing ${commands.length} commands sequentially`);
    }
    
    let obstacleEncountered = false;
    let batteryEmpty = false;
    let completedCommands = 0;
    
    // Execute each command in sequence with a delay between them
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      const result = await this.sendCommandSilently(command);
      
      // Check if battery is empty
      if (result && result.batteryEmpty) {
        batteryEmpty = true;
        break;
      }
      
      // Check if an obstacle was detected
      if (result && result.obstacleDetected) {
        obstacleEncountered = true;
        break;
      }
      
      completedCommands++;
      
      // Add a small delay between commands to see the sequence
      if (i < commands.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    // Send final status update with message based on what happened
    if (batteryEmpty && this.roverReturn) {
      this.sendStatusUpdateWithMessage(`🔋 BATTERY EMPTY! Completed ${completedCommands}/${commands.length} commands. Use 'R' to recharge.`, true);
    } else if (obstacleEncountered && this.roverReturn) {
      this.sendStatusUpdateWithMessage(`⚠️ OBSTACLE DETECTED! Completed ${completedCommands}/${commands.length} commands before encountering obstacle.`, true);
    } else if (this.roverReturn) {
      // All commands completed successfully
      this.sendStatusUpdateWithMessage(`✅ All ${commands.length} commands executed successfully.`);
    }
  }

  private sendStatusUpdateWithMessage(message: string, isAlert: boolean = false): void {
    if (!this.roverReturn) return;
    
    // Store reference to this.roverReturn to use inside the callback
    const roverReturn = this.roverReturn;
    
    setTimeout(() => {
      try {
        const status: RoverStatus = {
          position: this.roverControl.getPosition(),
          orientation: this.roverControl.getOrientation(),
          battery: this.roverControl.getBattery(),
          health: this.roverControl.getBattery() > 20 ? (isAlert ? 'warning' : 'healthy') : 'critical',
          mission: isAlert ? 'Exploration - Issue Detected' : 'Exploration',
          obstacleDetected: isAlert && message.includes('OBSTACLE'),
          lastUpdate: new Date(),
          speed: 0,
          sensors: {
            camera: true,
            lidar: true,
            thermometer: true
          }
        };
        
        const response = {
          id: uuidv4(),
          status: status,
          message: message,
          alert: isAlert
        };
        
        roverReturn.handleRoverResponse(response);
      } catch (error) {
        console.error("Error generating status update:", error);
      }
    }, 300);
  }

  private async sendCommandSilently(command: Command): Promise<any> {
    console.log(`Processing command: ${command.type}`);
    
    // Handle command locally (simulation) without sending response messages
    const result = this.handleCommandLocallySilent(command);
    
    try {
      // Send command to rover via messaging but don't show response
      await this.messaging.sendCommandToRover(command);
    } catch (error) {
      console.error("Error sending command to rover:", error);
    }
    
    return result;
  }
  
  private handleCommandLocallySilent(command: Command): any {
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
          result = this.handleSolarCharging();
          break;
        case 'scan':
          this.obstacles.discoverAllObstacles();
          result = {
            obstacles: this.obstacles.scanObstacles(),
            message: 'Scan complete. Obstacles detected and mapped.'
          };
          this.updateMap();
          // Scan shows status update with message
          this.sendStatusUpdateWithMessage('🔍 Scan complete. Obstacles detected and mapped.');
          break;
        case 'return':
          result = {
            message: 'Return command received. Planning route back to base.'
          };
          // Return shows status update with message
          this.sendStatusUpdateWithMessage('🏠 Return command received. Planning route back to base.');
          break;
        default:
          console.warn(`Unknown command type: ${command.type}`);
          return null;
      }
      
      // Update map with new position (silently)
      this.updateMap();
      
      return result;
    } catch (error) {
      console.error(`Error executing command ${command.type}:`, error);
      return null;
    }
  }
  
  private async handleSolarCharging(): Promise<any> {
    if (!this.roverReturn) return { message: 'Solar charging initiated.' };

    const currentBattery = this.roverControl.getBattery();
    
    // Check if battery is already full
    if (currentBattery >= 100) {
      this.roverReturn.handleRoverResponse('🔋 Battery is already fully charged!');
      return { message: 'Battery already full.' };
    }

    // Deploy solar panel
    this.roverReturn.handleRoverResponse('🔆 Deploying solar panel...');
    
    // Check if we need to show 50% message
    if (currentBattery < 50) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.roverControl.setBattery(50); // Set battery to 50%
      this.roverReturn.handleRoverResponse('🔋 Charging... 50% complete');
    }
    
    // Always charge to 100% if not already there
    if (currentBattery < 100) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.roverControl.chargeBattery(); // Charge to 100%
      this.roverReturn.handleRoverResponse('🔋 Charging... 100% complete');
    }
    
    // Completion message
    await new Promise(resolve => setTimeout(resolve, 500));
    this.roverReturn.handleRoverResponse('🔆 Solar panel retracted. Battery fully charged!');
    
    return { message: 'Solar charging complete.' };
  }
  
  private updateMap(): void {
    if (!this.mapDisplay) return;
    
    const position = this.roverControl.getPosition();
    const orientation = this.roverControl.getOrientation();
    
    // Get only discovered obstacles
    const discoveredObstacles = this.obstacles.scanObstacles();
    
    this.mapDisplay.updateMap(position, discoveredObstacles, orientation);
  }
  
  private simulateRoverResponse(command: Command, result: any): void {
    // Only call this for special commands like scan and return, not for movement
    if (command.type !== 'Z' && command.type !== 'S' && command.type !== 'Q' && command.type !== 'D') {
      if (!this.roverReturn) return;
      
      setTimeout(() => {
        try {
          if (!this.roverReturn) return; // Add null check here
          
          const status: RoverStatus = {
            position: this.roverControl.getPosition(),
            orientation: this.roverControl.getOrientation(),
            battery: this.roverControl.getBattery(),
            health: this.roverControl.getBattery() > 20 ? 'healthy' : 'warning',
            mission: 'Exploration',
            lastUpdate: new Date(),
            speed: 0.5,
            sensors: {
              camera: true,
              lidar: true,
              thermometer: true
            }
          };
          
          const response = {
            id: uuidv4(),
            status: status,
            message: result.message || `Command '${command.type}' executed successfully.`,
            result: result
          };
          
          this.roverReturn.handleRoverResponse(response);
        } catch (error) {
          console.error("Error generating rover response:", error);
        }
      }, 500);
    }
  }
}

// Create and start the application
console.log("Initializing Rover Mission Control");
const app = new RoverMissionApp();

// Add to window for debugging purposes
(window as any).roverApp = app;