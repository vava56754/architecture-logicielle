import { Command } from '../../interfaces/common.interface';

export interface IMovementScenario {
  runMovementScenario(scenario: string): Promise<boolean>;
  createCustomScenario(commands: Command[]): void;
  getAvailableScenarios(): string[];
  pauseScenario(): void;
  resumeScenario(): void;
  stopScenario(): void;
  getScenarioProgress(): number;
}
