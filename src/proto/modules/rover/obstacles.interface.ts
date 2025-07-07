import { Position, Obstacle } from './rover-types.interface';

export interface IObstacles {
  isPathClear(target: Position): boolean;
  scanObstacles(): Obstacle[];
  detectNearbyObstacles(radius: number): Obstacle[];
  getObstacleAt(position: Position): Obstacle | null;
  hasDiscoveredObstacle(x: number, y: number): boolean;
}