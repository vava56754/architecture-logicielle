import { Orientation, Position } from '../../../interfaces/common.interface';

export interface ILocalisation {
  updatePosition(position: Position): void;
  getPosition(): Position;
  getOrientation(): Orientation;
  setOrientation(orientation: Orientation): void;
  turnLeft(): Orientation;
  turnRight(): Orientation;
  calibrate(): void;
  isCalibrated(): boolean;
}
