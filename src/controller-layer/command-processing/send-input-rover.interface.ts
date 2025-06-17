import { Command } from '../../interfaces/common.interface';

export interface ISendInputRover {
  sendCommandToRover(command: Command): Promise<boolean>;
  sendCommandString(commands: string): Promise<boolean>;
  queueCommand(command: Command): void;
  getQueueSize(): number;
  clearQueue(): void;
  isConnected(): boolean;
}
