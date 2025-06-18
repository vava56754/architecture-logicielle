import { Message } from '../../common/common.interface';

export interface IReceiveMessage {
  receiveMessage(): Promise<Message>;
  onMessageReceived(callback: (message: Message) => void): void;
  startListening(port?: number): void;
  stopListening(): void;
  isListening(): boolean;
  broadcastMessage(message: any): void;
}
