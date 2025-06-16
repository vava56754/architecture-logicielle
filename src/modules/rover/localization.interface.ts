import { Position } from '../../interfaces/common.interface';

export interface ILocalization {
  updatePosition(position: Position): void;
  getPosition(): Position;
  getOrientation(): 'N' | 'E' | 'S' | 'W';
  setOrientation(orientation: 'N' | 'E' | 'S' | 'W'): void;
  turnLeft(): 'N' | 'E' | 'S' | 'W';
  turnRight(): 'N' | 'E' | 'S' | 'W';
  calibrate(): void;
  isCalibrated(): boolean;
}
