import { RoverState } from '../domain/Rover';

export interface IRover {
  getState(): RoverState;
  moveForward(): void;
  moveBackward(): void;
  turnLeft(): void;
  turnRight(): void;
} 