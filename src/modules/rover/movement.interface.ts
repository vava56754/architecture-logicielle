import { Position, RoverState } from '../../common/common.interface';

export interface IMovement {
  moveForward(): RoverState;
  moveBackward(): RoverState;
  getCurrentPosition(): Position;
  setSpeed(speed: number): void;
  getSpeed(): number;
  stop(): void;
  isMoving(): boolean;
  turnLeft(): RoverState;
  turnRight(): RoverState;
}
