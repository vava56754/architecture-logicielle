import { RoverStatus, Position } from '../../interfaces/common.interface';

export interface IDisplayAllUserInput {
  displayAllInputs(): void;
  displayRoverStatus(status: RoverStatus): void;
  generateMapVisualization(roverPosition: Position, width: number, height: number, obstacles: Position[]): string;
  clearDisplay(): void;
}
