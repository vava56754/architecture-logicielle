import { Command } from '../common/common.interface';

export interface IInput {
  captureUserInput(): Command;
  validateCommand(command: string): boolean;
  getInputHistory(): Command[];
}
