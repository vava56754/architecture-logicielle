import { Orientation, Position } from '../../common/common.interface';

export interface ILocalisation {
  updatePosition(position: Position): void;
  getPosition(): Position;
  getOrientation(): Orientation;
  setOrientation(orientation: Orientation): void;
  turnLeft(): Orientation;
  turnRight(): Orientation;
}
