import { Position, Obstacle } from '../../interfaces/common.interface';

export interface IMap {
  updateMap(position: Position, obstacles: Obstacle[]): void;
  getMapData(): any;
  displayMap(): void;
  clearMap(): void;
  exportMap(format: string): string;
  getMapSize(): { width: number; height: number };
  setMapBounds(bounds: { minX: number; maxX: number; minY: number; maxY: number }): void;
}
