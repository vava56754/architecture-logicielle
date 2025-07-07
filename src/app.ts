// Import necessary modules and classes
import { Rover } from './modules/rover/rover-control';
import { Obstacles } from './modules/rover/obstacles';
import { WebSocketClient } from './modules/network/websocket';
import { Messaging } from './modules/mission-control/Messaging';
import { MissionControl } from './modules/mission-control/MissionControl';
import { UIManager } from './modules/ui/UIManager';
import { Command } from './modules/rover/rover-types.interface';


class RoverMissionApp {
  private rover: Rover;
  private obstacles: Obstacles;
  private websocket: WebSocketClient;
  private messaging: Messaging;
  private missionControl: MissionControl;
  private uiManager: UIManager;

  constructor() {
    console.log("Creating Rover Mission App...");

    // Initialize core components (respecte les dépendances)
    this.obstacles = new Obstacles();
    this.rover = new Rover(this.obstacles);
    this.websocket = new WebSocketClient();
    this.messaging = new Messaging(this.websocket);
    this.missionControl = new MissionControl(this.rover, this.obstacles, this.messaging);
    this.uiManager = new UIManager();
  }

  async start(): Promise<void> {
    console.log("Starting rover mission application...");

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      await new Promise(resolve =>
        document.addEventListener('DOMContentLoaded', resolve)
      );
    }

    // Initialize connection
    await this.websocket.connectToRover(
      'ws://localhost:8081',
      this.uiManager.getRoverReturn(),
      this.rover
    );

    // Initialize UI with current state
    this.updateUI();

    // Start command processing loop
    this.startCommandLoop();
  }

  private updateUI(): void {
    const position = this.missionControl.getRoverPosition();
    const orientation = this.missionControl.getRoverOrientation();
    const obstacles = this.missionControl.getDiscoveredObstacles();

    this.uiManager.updateMap(position, obstacles, orientation);
  }

  private startCommandLoop(): void {
    const processNextCommand = async () => {
      try {
        const placeholderCommand = await this.uiManager.captureUserInput();
        const inputStr = placeholderCommand.parameters?.rawInput?.toString() || '';

        this.uiManager.displayMessage(`\n📡 Received command sequence: ${inputStr}`);

        const commands = this.uiManager.parseCommands(inputStr);

        if (commands.length > 0) {
          await this.executeCommandSequence(commands);
        } else {
          this.uiManager.displayMessage(`❌ No valid commands found in: ${inputStr}`);
        }
      } catch (error) {
        console.error('Error processing command:', error);
      }

      setTimeout(processNextCommand, 0);
    };

    processNextCommand();
  }

  private async executeCommandSequence(commands: Command[]): Promise<void> {
    if (commands.length > 1) {
      this.uiManager.displayMessage(`Executing ${commands.length} commands sequentially`);
    }

    const result = await this.missionControl.executeCommandSequence(commands);

    // Update UI after command execution
    this.updateUI();

    // Display results
    if (result.batteryEmpty) {
      this.uiManager.displayStatusUpdate(
        this.missionControl.getRoverStatus(),
        `🔋 BATTERY EMPTY! Completed ${result.completedCommands}/${commands.length} commands. Use 'R' to recharge.`,
        true
      );
    } else if (result.obstacleEncountered) {
      this.uiManager.displayStatusUpdate(
        this.missionControl.getRoverStatus(),
        `⚠️ OBSTACLE DETECTED! Completed ${result.completedCommands}/${commands.length} commands before encountering obstacle.`,
        true
      );
    } else {
      this.uiManager.displayStatusUpdate(
        this.missionControl.getRoverStatus(),
        `✅ All ${commands.length} commands executed successfully.`
      );
    }
  }
}

// Point d'entrée de l'application
console.log("Initializing Rover Mission Control");
const app = new RoverMissionApp();
app.start().catch(console.error);

// Add to window for debugging purposes
(window as any).roverApp = app;