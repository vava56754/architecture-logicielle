import { Message } from '../../interfaces/common.interface';

export interface IReceiveMessage {
  receiveMessage(): Promise<Message>;
  onMessageReceived(callback: (message: Message) => void): void;
  getLastMessage(): Message | null;
  isListening(): boolean;
  startListening(): void;
  stopListening(): void;
}
