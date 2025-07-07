import { Command } from '../rover/rover-types.interface';

export interface IInput {
  captureUserInput(): Promise<Command>;
  validateCommand(command: string): boolean;
  parseCommands(input: string): Command[];
  close(): void;
}
