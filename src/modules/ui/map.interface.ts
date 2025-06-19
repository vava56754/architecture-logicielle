import { Position, Obstacle } from '../rover/rover-types.interface';

export interface IMap {
  updateMap(position: Position, obstacles: Obstacle[], orientation?: any): void;
  displayMap(): void;
}