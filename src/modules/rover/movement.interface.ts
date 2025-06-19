import { Position, RoverState, Orientation } from './rover-types.interface';

export interface IRoverControl {
  // Localisation
  updatePosition(position: Position): void;
  getPosition(): Position;
  getOrientation(): Orientation;
  setOrientation(orientation: Orientation): void;
  // Mouvement
  moveForward(): RoverState;
  moveBackward(): RoverState;
  turnLeft(): RoverState;
  turnRight(): RoverState;
}
