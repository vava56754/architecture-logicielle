import { IRoverReturn } from './rover-return.interface';
import { RoverStatus } from '../rover/rover-types.interface';

export class RoverReturn implements IRoverReturn {
  private outputElement: HTMLElement;
  private roverStatus: RoverStatus | null = null;
  private connected: boolean = false;
  private lastResponseTime: Date | null = null;
  
  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with ID ${containerId} not found`);
    }
    
    // Create output display
    this.outputElement = document.createElement('div');
    this.outputElement.className = 'rover-output';
    this.outputElement.style.cssText = `
      background-color: #1a1a1a;
      color: #00ff00;
      font-family: monospace;
      padding: 10px;
      height: 200px;
      overflow-y: auto;
      border: 1px solid #444;
      margin-top: 20px;
    `;
    
    container.appendChild(this.outputElement);
    
    // Add connection status
    this.updateOutputDisplay('System initialized. Waiting for rover connection...');
  }
  
  handleRoverResponse(response: any): void {
    this.lastResponseTime = new Date();
    this.connected = true;
    
    let message: string;
    let isAlert = false;
    
    if (typeof response === 'string') {
      message = response;
    } else if (response && typeof response === 'object') {
      if (response.status) {
        this.updateRoverStatus(response.status);
      }
      
      if (response.message) {
        message = response.message;
      } else {
        message = `Received: ${JSON.stringify(response)}`;
      }
      
      isAlert = response.alert || response.error;
    } else {
      message = `Received unformatted response: ${response}`;
    }
    
    this.updateOutputDisplay(message, isAlert);
  }
  
  updateRoverStatus(status: RoverStatus): void {
    this.roverStatus = status;
    this.connected = true;
    this.lastResponseTime = new Date();
    
    // Update status display
    const statusMsg = `
      Status update:
      Position: (${status.position.x}, ${status.position.y}, ${status.position.z})
      Orientation: ${status.orientation.orientation}
      Battery: ${status.battery}%
      Health: ${status.health}
      Mission: ${status.mission}
      Sensors: Camera ${status.sensors.camera ? 'ON' : 'OFF'}, 
               LIDAR ${status.sensors.lidar ? 'ON' : 'OFF'}
    `;
    
    this.updateOutputDisplay(statusMsg);
  }
  
  getRoverStatus(): RoverStatus | null {
    return this.roverStatus;
  }
  
  isRoverConnected(): boolean {
    if (!this.lastResponseTime) return false;
    
    // Consider rover disconnected if no response for more than 30 seconds
    const now = new Date();
    const timeDiff = now.getTime() - this.lastResponseTime.getTime();
    return this.connected && timeDiff < 30000;
  }
  
  getLastResponseTime(): Date | null {
    return this.lastResponseTime;
  }
  
  private updateOutputDisplay(message: string, isAlert: boolean = false): void {
    const timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const entry = document.createElement('div');
    entry.className = 'output-line';
    
    if (isAlert) {
      entry.style.color = '#ff0000';
      entry.style.fontWeight = 'bold';
      entry.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
      entry.style.padding = '5px';
      entry.style.margin = '5px 0';
      entry.style.borderLeft = '3px solid #ff0000';
    }
    
    entry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
    
    this.outputElement.appendChild(entry);
    
    // Add separator line after command sequences for better readability
    if (message.includes('All') && message.includes('commands executed successfully') ||
        message.includes('OBSTACLE DETECTED') ||
        message.includes('BATTERY EMPTY') ||
        message.includes('Solar panel retracted')) {
      const separator = document.createElement('div');
      separator.style.cssText = `
        border-bottom: 1px solid #444;
        margin: 10px 0;
        height: 1px;
      `;
      this.outputElement.appendChild(separator);
    }
    
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
  }
}

