import { Position, Obstacle } from '../../common/common.interface';

export interface IObstacles {
  scanObstacles(): Obstacle[];
  isPathClear(target: Position): boolean;
  getObstacleAt(position: Position): Obstacle | null;
  detectNearbyObstacles(radius: number): Obstacle[];
  discoverObstacle(x: number, y: number): void;
  hasDiscoveredObstacle(x: number, y: number): boolean;
}