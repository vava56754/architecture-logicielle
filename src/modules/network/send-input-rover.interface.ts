import { Command } from '../../interfaces/common.interface';

export interface ISendInputRover {
  sendCommandToRover(command: Command): Promise<boolean>;
  queueCommand(command: Command): void;
  getQueueSize(): number;
  clearQueue(): void;
  isConnected(): boolean;
  getLatency(): number;
}
