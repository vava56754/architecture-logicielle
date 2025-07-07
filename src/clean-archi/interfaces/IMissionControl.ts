import { RoverState } from '../domain/Rover';

export interface IMissionControl {
  runSequence(commands: string): RoverState;
} 