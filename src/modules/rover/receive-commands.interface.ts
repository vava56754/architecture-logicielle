import { Command, RoverState } from '../../interfaces/common.interface';

export interface IReceiveCommands {
  receiveCommand(command: Command): void;
  executeCommands(commands: string): RoverState;
  executeCommand(command: string): RoverState;
  getCommandQueue(): Command[];
  clearQueue(): void;
  isProcessing(): boolean;
}
