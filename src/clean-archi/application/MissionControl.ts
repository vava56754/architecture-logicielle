import { RoverState } from '../domain/Rover';
import { IRover } from '../interfaces/IRover';
import { IMissionControl } from '../interfaces/IMissionControl';
import { ICommandInterpreter } from '../interfaces/ICommandInterpreter';

export class MissionControl implements IMissionControl {
  private rover: IRover;
  private interpreter: ICommandInterpreter;

  constructor(rover: IRover, interpreter: ICommandInterpreter) {
    this.rover = rover;
    this.interpreter = interpreter;
  }

  runSequence(commands: string): RoverState {
    this.interpreter.execute(commands);
    return this.rover.getState();
  }
} 