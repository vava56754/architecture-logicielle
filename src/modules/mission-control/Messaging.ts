import { IMessaging } from './messaging.interface';
import { Command } from '../rover/rover-types.interface';
import { IWebSocket } from '../network/websocket.interface';

export class Messaging implements IMessaging {
  private commandQueue: Command[] = [];
  private responseCallback: ((response: any) => void) | null = null;
  
  constructor(private socket: IWebSocket) {
    this.socket.onMessage((data) => {
      console.log('Messaging received:', data);
      
      if (data.type === 'response' && this.responseCallback) {
        this.responseCallback(data);
      } else if (data.type === 'command') {
        this.commandQueue.push(data as Command);
      }
    });
  }

  async sendCommandToRover(command: Command): Promise<boolean> {
    console.log('Sending command to rover:', command);
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

  onResponse(callback: (response: any) => void): void {
    this.responseCallback = callback;
  }
}
