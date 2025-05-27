import { Command } from '../../interfaces/common.interface';

export interface IReceiveCommands {
  receiveCommand(command: Command): void;
  processCommands(): void;
  getCommandQueue(): Command[];
  clearQueue(): void;
  getPendingCommandsCount(): number;
  isProcessing(): boolean;
}
