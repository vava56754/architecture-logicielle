import { Message } from '../../interfaces/common.interface';

export interface IRepeater {
  amplifySignal(message: Message): Message;
  getSignalStrength(): number;
  setSignalPower(power: number): void;
  isActive(): boolean;
  activate(): void;
  deactivate(): void;
}
