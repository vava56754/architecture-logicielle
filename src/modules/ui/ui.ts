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

    inputContainer.appendChild(this.inputElement);
    inputContainer.appendChild(sendButton);
    
    container.appendChild(title);
    container.appendChild(this.mapElement);
    container.appendChild(this.outputElement);
    container.appendChild(inputContainer);
    
    document.body.appendChild(container);

    this.updateMap(this.rover.getPosition(), [], this.rover.getOrientation());

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
        const result = this.executeCommand(command);
        if (result === false) {
          this.showMessage('Arrêt de la séquence : obstacle rencontré.');
          break;
        }
      }
    }
  }

  private executeCommand(command: Command): boolean | void {
    try {
      switch (command.type) {
        case 'Z':
          if ((this.rover as any).moveForward.length > 0) {
            const res = (this.rover as any).moveForward((msg: string) => this.showMessage(msg));
            this.showMessage(`Moved forward`);
            this.updateMap(this.rover.getPosition(), [], this.rover.getOrientation());
            return res;
          } else {
            const res = this.rover.moveForward();
            this.showMessage(`Moved forward`);
            this.updateMap(this.rover.getPosition(), [], this.rover.getOrientation());
            return res;
          }
        case 'S':
          if ((this.rover as any).moveBackward.length > 0) {
            const res = (this.rover as any).moveBackward((msg: string) => this.showMessage(msg));
            this.showMessage(`Moved backward`);
            this.updateMap(this.rover.getPosition(), [], this.rover.getOrientation());
            return res;
          } else {
            const res = this.rover.moveBackward();
            this.showMessage(`Moved backward`);
            this.updateMap(this.rover.getPosition(), [], this.rover.getOrientation());
            return res;
          }
        case 'Q':
          this.rover.turnLeft();
          this.showMessage(`Turned left`);
          break;
        case 'D':
          this.rover.turnRight();
          this.showMessage(`Turned right`);
          break;
      }
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
    return Promise.resolve({
      id: uuidv4(),
      type: 'Z',
      timestamp: new Date()
    });
  }

  updateMap(position: { x: number; y: number; }, obstacles: any[], orientation: any): void {
    if (!this.mapElement) return;
    
    this.mapElement.innerHTML = '';

    const gridSize = 11; 
    const cellSize = 25;
    const gridRadius = Math.floor(gridSize / 2);

    const toroidalWrap = (coord: number) => {
      const range = gridRadius * 2 + 1;
      return ((coord % range) + range) % range - gridRadius;
    };

    const toroidalX = toroidalWrap(position.x);
    const toroidalY = toroidalWrap(position.y);
    
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
        
        const mapX = x - gridRadius;
        const mapY = gridRadius - y;
        if (x === gridRadius && y === gridRadius) {
          cell.style.backgroundColor = '#333';
        }

        if (mapX === toroidalX && mapY === toroidalY) {
          cell.style.backgroundColor = '#333';
          
          let arrow = '●';
          switch (orientation) {
            case 'N': arrow = '↑'; break;
            case 'E': arrow = '→'; break;
            case 'S': arrow = '↓'; break;
            case 'W': arrow = '←'; break;
          }
          
          cell.innerHTML = `<div style="text-align:center;line-height:${cellSize-1}px">${arrow}</div>`;
        }

        cell.title = `(${mapX}, ${mapY})`;
        
        this.mapElement.appendChild(cell);
      }
    }
    
    const posInfo = document.createElement('div');
    posInfo.style.cssText = `
      position: absolute;
      bottom: 5px;
      left: 5px;
      color: #0f0;
      font-size: 12px;
    `;

    posInfo.textContent = `[Map: (${toroidalX}, ${toroidalY})], Facing: ${orientation}`;
    this.mapElement.appendChild(posInfo);
  }
}
