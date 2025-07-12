import { IMissionControle } from './mission-control.interface';
import { IRover, Command } from '../rover/rover.interface';

export class MissionControl implements IMissionControle {
  private commandQueue: Command[] = [];
  
  constructor(private rover: IRover) {}
  
  async sendCommandToRover(command: Command, onError?: (msg: string) => void): Promise<boolean> {
    try {
      switch (command.type) {
        case 'Z':
          return (this.rover as any).moveForward.length > 0
            ? (this.rover as any).moveForward(onError)
            : Boolean(this.rover.moveForward());
        case 'S':
          return (this.rover as any).moveBackward.length > 0
            ? (this.rover as any).moveBackward(onError)
            : Boolean(this.rover.moveBackward());
        case 'Q':
          this.rover.turnLeft();
          return true;
        case 'D':
          this.rover.turnRight();
          return true;
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
