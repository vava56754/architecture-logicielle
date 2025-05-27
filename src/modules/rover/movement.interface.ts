import { Position } from '../../interfaces/common.interface';

export interface IMovement {
  move(direction: string, distance: number): Promise<boolean>;
  getCurrentPosition(): Position;
  setSpeed(speed: number): void;
  getSpeed(): number;
  stop(): void;
  rotate(angle: number): Promise<boolean>;
  isMoving(): boolean;
}
