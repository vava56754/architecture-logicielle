export type Orientation = 'N' | 'E' | 'S' | 'W';

export interface Position {
  x: number;
  y: number;
}

export interface RoverState {
  position: Position;
  orientation: Orientation;
}

export interface IRover {
  getPosition(): Position;
  getOrientation(): Orientation;
  getState(): RoverState;

  moveForward(): RoverState;
  moveBackward(): RoverState;
  turnLeft(): RoverState;
  turnRight(): RoverState;
} 