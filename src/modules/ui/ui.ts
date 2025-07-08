import { IUI } from './ui.interface';
import { IRover, Command } from '../rover/rover.interface';
import { v4 as uuidv4 } from 'uuid';

export class WebUI implements IUI {
  private outputElement: HTMLElement | null = null;
  private inputElement: HTMLInputElement | null = null;
  private mapElement: HTMLElement | null = null;
  private rover: IRover;

  constructor(rover: IRover) {
    this.rover = rover;
    this.initUI();
  }

  private initUI(): void {
    // Create UI elements
    const container = document.createElement('div');
    container.style.cssText = `
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: monospace;
      background-color: #222;
      color: #0f0;
    `;
    
    const title = document.createElement('h1');
    title.textContent = 'Rover Control Panel';
    title.style.textAlign = 'center';
    
    this.mapElement = document.createElement('div');
    this.mapElement.style.cssText = `
      width: 300px;
      height: 300px;
      margin: 20px auto;
      border: 1px solid #0f0;
      position: relative;
    `;
    
    this.outputElement = document.createElement('div');
    this.outputElement.style.cssText = `
      height: 200px;
      border: 1px solid #0f0;
      margin-bottom: 20px;
      padding: 10px;
      overflow-y: auto;
    `;
    
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.style.cssText = `
      flex: 1;
      padding: 8px;
      background-color: #333;
      color: #0f0;
      border: 1px solid #0f0;
    `;
    this.inputElement.placeholder = 'Enter commands (Z, S, Q, D)';
    
    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.style.cssText = `
      padding: 8px 16px;
      background-color: #0f0;
      color: #000;
      border: none;
      cursor: pointer;
      margin-left: 10px;
    `;
    
    // Assembly
    inputContainer.appendChild(this.inputElement);
    inputContainer.appendChild(sendButton);
    
    container.appendChild(title);
    container.appendChild(this.mapElement);
    container.appendChild(this.outputElement);
    container.appendChild(inputContainer);
    
    document.body.appendChild(container);
    
    // Init map
    this.updateMap(this.rover.getPosition(), [], this.rover.getOrientation());
    
    // Event listeners
    sendButton.addEventListener('click', this.handleSendCommand.bind(this));
    this.inputElement.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSendCommand();
    });
  }
  
  private handleSendCommand(): void {
    if (!this.inputElement || !this.inputElement.value.trim()) return;
    
    const commandText = this.inputElement.value.trim().toUpperCase();
    this.inputElement.value = '';
    
    this.showMessage(`Sending commands: ${commandText}`);
    
    // Process each character as a command
    for (const char of commandText) {
      let commandType: 'Z' | 'S' | 'Q' | 'D' | null = null;
      
      switch (char) {
        case 'Z': commandType = 'Z'; break;
        case 'S': commandType = 'S'; break;
        case 'Q': commandType = 'Q'; break;
        case 'D': commandType = 'D'; break;
      }
      
      if (commandType) {
        const command: Command = {
          id: uuidv4(),
          type: commandType,
          timestamp: new Date()
        };
        
        this.executeCommand(command);
      }
    }
  }
  
  private executeCommand(command: Command): void {
    try {
      switch (command.type) {
        case 'Z':
          this.rover.moveForward();
          this.showMessage(`Moved forward`);
          break;
        case 'S':
          this.rover.moveBackward();
          this.showMessage(`Moved backward`);
          break;
        case 'Q':
          this.rover.turnLeft();
          this.showMessage(`Turned left`);
          break;
        case 'D':
          this.rover.turnRight();
          this.showMessage(`Turned right`);
          break;
      }
      
      // Update map after command
      this.updateMap(this.rover.getPosition(), [], this.rover.getOrientation());
      
    } catch (error) {
      this.showMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  showMessage(message: string): void {
    if (!this.outputElement) return;
    
    const line = document.createElement('div');
    line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    
    this.outputElement.appendChild(line);
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
  }

  promptCommand(): Promise<Command> {
    // This is handled through the UI events now
    return Promise.resolve({
      id: uuidv4(),
      type: 'Z',
      timestamp: new Date()
    });
  }

  updateMap(position: { x: number; y: number; }, obstacles: any[], orientation: any): void {
    if (!this.mapElement) return;
    
    this.mapElement.innerHTML = '';
    
    // Create grid
    const gridSize = 11; // 11x11 grid with center at (5,5)
    const cellSize = 25;
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cell = document.createElement('div');
        cell.style.cssText = `
          position: absolute;
          left: ${x * cellSize}px;
          top: ${y * cellSize}px;
          width: ${cellSize - 1}px;
          height: ${cellSize - 1}px;
          border: 1px solid #333;
        `;
        
        // Convert to map coordinates
        const mapX = x - Math.floor(gridSize / 2);
        const mapY = Math.floor(gridSize / 2) - y;
        
        // Highlight center
        if (x === Math.floor(gridSize / 2) && y === Math.floor(gridSize / 2)) {
          cell.style.backgroundColor = '#333';
        }
        
        // Show rover
        if (mapX === position.x && mapY === position.y) {
          cell.style.backgroundColor = '#0f0';
          
          // Show orientation
          let arrow = '●';
          switch (orientation) {
            case 'N': arrow = '↑'; break;
            case 'E': arrow = '→'; break;
            case 'S': arrow = '↓'; break;
            case 'W': arrow = '←'; break;
          }
          
          cell.innerHTML = `<div style="text-align:center;line-height:${cellSize-1}px">${arrow}</div>`;
        }
        
        // Show coordinates in tooltip
        cell.title = `(${mapX}, ${mapY})`;
        
        this.mapElement.appendChild(cell);
      }
    }
    
    // Show position info
    const posInfo = document.createElement('div');
    posInfo.style.cssText = `
      position: absolute;
      bottom: 5px;
      left: 5px;
      color: #0f0;
      font-size: 12px;
    `;
    posInfo.textContent = `Position: (${position.x}, ${position.y}), Facing: ${orientation}`;
    this.mapElement.appendChild(posInfo);
  }
}
