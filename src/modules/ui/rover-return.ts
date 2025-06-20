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
    } else {
      message = `Received unformatted response: ${response}`;
    }
    
    this.updateOutputDisplay(message);
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
      Speed: ${status.speed} m/s
      Sensors: Camera ${status.sensors.camera ? 'ON' : 'OFF'}, 
               LIDAR ${status.sensors.lidar ? 'ON' : 'OFF'}, 
               Thermometer ${status.sensors.thermometer ? 'ON' : 'OFF'}
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
  
  private updateOutputDisplay(message: string): void {
    const timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const entry = document.createElement('div');
    entry.className = 'output-line';
    entry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
    
    this.outputElement.appendChild(entry);
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
  }
}
