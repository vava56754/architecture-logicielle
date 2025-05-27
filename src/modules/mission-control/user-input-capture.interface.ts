import { Command } from '../../interfaces/common.interface';

export interface IUserInputCapture {
  captureUserInput(): Command;
  validateCommand(command: string): boolean;
  parseCommands(input: string): Command[];
  getInputHistory(): Command[];
  clearHistory(): void;
}
