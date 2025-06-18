import { Command } from '../../common/common.interface';

export interface IInput {
  captureUserInput(): Command;
  validateCommand(command: string): boolean;
  parseCommands(input: string): Command[];
  getInputHistory(): Command[];
  clearHistory(): void;
}
