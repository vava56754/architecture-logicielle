import { Position, Obstacle } from '../../interfaces/common.interface';

export interface IMap {
  getWidth(): number;
  getHeight(): number;
  updateMap(position: Position, obstacles: Obstacle[]): void;
  getMapData(): any;
  displayMap(): void;
  isObstacle(x: number, y: number): boolean;
  getNextValidPosition(x: number, y: number, newX: number, newY: number): { x: number; y: number; obstacle: boolean };
  wrapPosition(x: number, y: number): Position;
}
