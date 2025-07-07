import { IRover } from '../interfaces/IRover';
import { ICommandInterpreter } from '../interfaces/ICommandInterpreter';

export class CommandInterpreter implements ICommandInterpreter {
  private rover: IRover;

  constructor(rover: IRover) {
    this.rover = rover;
  }

  execute(commands: string): void {
    for (const cmd of commands.toUpperCase()) {
      switch (cmd) {
        case 'A':
          this.rover.moveForward();
          break;
        case 'R':
          this.rover.moveBackward();
          break;
        case 'G':
          this.rover.turnLeft();
          break;
        case 'D':
          this.rover.turnRight();
          break;
        default:
          // Ignore unknown commands
          break;
      }
    }
  }
} 