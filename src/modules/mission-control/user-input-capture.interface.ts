import { Command } from '../../interfaces/common.interface';

export interface IUserInputCapture {
  captureUserInput(): Command;
  validateInput(input: string): boolean;
  getInputHistory(): Command[];
  clearHistory(): void;
  setInputMode(mode: 'manual' | 'automatic'): void;
  getCurrentMode(): string;
}
