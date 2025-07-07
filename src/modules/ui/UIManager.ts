import { MapDisplay } from './map';
import { CommandInput } from './input';
import { RoverReturn } from './rover-return';
import { Command } from '../rover/rover-types.interface';

export class UIManager {
    private mapDisplay: MapDisplay;
    private commandInput: CommandInput;
    private roverReturn: RoverReturn;

    constructor() {
        this.createUIContainer();
        this.mapDisplay = new MapDisplay('map-container');
        this.commandInput = new CommandInput('input-container');
        this.roverReturn = new RoverReturn('output-container');
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

    async captureUserInput(): Promise<Command> {
        return this.commandInput.captureUserInput();
    }

    parseCommands(input: string): Command[] {
        return this.commandInput.parseCommands(input);
    }

    displayMessage(message: string): void {
        this.roverReturn.handleRoverResponse(message);
    }

    displayStatusUpdate(status: any, message: string, isAlert: boolean = false): void {
        this.roverReturn.sendStatusUpdateWithMessage(status, message, isAlert);
    }

    updateMap(position: any, obstacles: any[], orientation: any): void {
        this.mapDisplay.updateMap(position, obstacles, orientation);
    }

    updateRoverStatus(status: any): void {
        this.roverReturn.updateRoverStatus(status);
    }

    getMapDisplay(): MapDisplay {
        return this.mapDisplay;
    }

    getRoverReturn(): RoverReturn {
        return this.roverReturn;
    }
}
