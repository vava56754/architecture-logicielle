import { Position, Obstacle } from '../../interfaces/common.interface';

export interface IObstacles {
  scanObstacles(): Obstacle[];
  isPathClear(target: Position): boolean;
  getObstacleAt(position: Position): Obstacle | null;
  detectNearbyObstacles(radius: number): Obstacle[];
  discoverObstacle(x: number, y: number): void;
  hasDiscoveredObstacle(x: number, y: number): boolean;
}
