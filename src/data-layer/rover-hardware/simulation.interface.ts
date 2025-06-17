import { Position, Obstacle, Command } from '../../interfaces/common.interface';

export interface ISimulation {
  startSimulation(): void;
  stopSimulation(): void;
  isRunning(): boolean;
  executeCommand(command: Command): any;
  getRoverPosition(): Position;
  getSimulationSpeed(): number;
  setSimulationSpeed(speed: number): void;
  generateRandomObstacles(count: number): Obstacle[];
  reset(): void;
}
