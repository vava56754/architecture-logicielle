import { Command, RoverState } from '../../interfaces/common.interface';

export interface IMovementScenario {
  runMovementScenario(scenario: string): Promise<RoverState>;
  createCustomScenario(name: string, commands: Command[]): void;
  getAvailableScenarios(): string[];
  loadPredefinedScenarios(): void;
  validateScenario(commands: Command[]): boolean;
  getScenarioProgress(): number;
}
