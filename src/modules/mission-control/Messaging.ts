import { IMessaging } from './messaging.interface';
import { Command } from '../rover/rover-types.interface';
import { IWebSocket } from '../network/websocket.interface';

export class Messaging implements IMessaging {
  private commandQueue: Command[] = [];
  
  constructor(private socket: IWebSocket) {
    this.simulateConnection();
    
    this.socket.onMessage((data) => {
      if (data && data.type === 'command') {
        this.commandQueue.push(data as Command);
      }
    });
  }

  private simulateConnection(): void {
    // Simulate a successful connection for development
    console.log("Simulating WebSocket connection for messaging");
  }

  async sendCommandToRover(command: Command): Promise<boolean> {
    return this.socket.send(command);
  }

  async receiveCommand(): Promise<Command> {
    return new Promise((resolve) => {
      const checkQueue = () => {
        if (this.commandQueue.length > 0) {
          resolve(this.commandQueue.shift()!);
        } else {
          setTimeout(checkQueue, 100);
        }
      };
      
      checkQueue();
    });
  }
}
