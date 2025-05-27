import { Position } from '../../interfaces/common.interface';

export interface ILocalization {
  updatePosition(position: Position): void;
  getPosition(): Position;
  calibrate(): void;
  getAccuracy(): number;
  isCalibrated(): boolean;
  resetPosition(): void;
}
