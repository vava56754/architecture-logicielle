import { Position, Obstacle } from '../common/common.interface';

export interface IMap {
  updateMap(position: Position, obstacles: Obstacle[]): void;
  displayMap(): void;
}