import { IMissionControle } from './mission-control.interface';
import { IRover, Command } from '../rover/rover.interface';

export class MissionControl implements IMissionControle {
  private commandQueue: Command[] = [];
  
  constructor(private rover: IRover) {}
  
  async sendCommandToRover(command: Command): Promise<boolean> {
    try {
      // Execute command directly on the rover
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
      
      // In a real system, you would send this over a network
      // and wait for a response from the physical rover
      
      return true;
    } catch (error) {
      console.error('Error executing command:', error);
      return false;
    }
  }
  
  async receiveCommand(): Promise<Command> {
    // In a real system, you would receive commands from external sources
    // For now, we'll just return from our queue or wait
    
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
  
  // Method to simulate adding commands to the queue
  // (This would come from external sources in a real system)
  addCommand(command: Command): void {
    this.commandQueue.push(command);
  }
}
