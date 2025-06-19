import { Position, Obstacle } from '../common/common.interface';

export interface IObstacles {
  scanObstacles(): Obstacle[];
  getObstacleAt(position: Position): Obstacle | null;
}