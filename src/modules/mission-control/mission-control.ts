import { IMissionControle } from './mission-control.interface';
import { IRover, Command } from '../rover/rover.interface';

export class MissionControl implements IMissionControle {
  private commandQueue: Command[] = [];
  
  constructor(private rover: IRover) {}
  
  async sendCommandToRover(command: Command): Promise<boolean> {
    try {
      switch (command.type) {
        case 'Z':
          this.rover.moveForward();
          break;
        case 'S':
          this.rover.moveBackward();
          break;
        case 'Q':
          this.rover.turnLeft();
          break;
        case 'D':
          this.rover.turnRight();
          break;
      }
      
      return true;
    } catch (error) {
      console.error('Error executing command:', error);
      return false;
    }
  }
  
  async receiveCommand(): Promise<Command> {
    return new Promise(resolve => {
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
