import { Position, RoverState } from '../../interfaces/common.interface';

export interface IMovement {
  moveForward(): RoverState;
  moveBackward(): RoverState;
  getCurrentPosition(): Position;
  setSpeed(speed: number): void;
  getSpeed(): number;
  stop(): void;
  isMoving(): boolean;
}
