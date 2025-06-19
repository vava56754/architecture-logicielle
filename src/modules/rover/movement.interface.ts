import { Position, RoverState } from '../../common/common.interface';

export interface IMovement {
  moveForward(): RoverState;
  moveBackward(): RoverState;
  getCurrentPosition(): Position;
  turnLeft(): RoverState;
  turnRight(): RoverState;
}
