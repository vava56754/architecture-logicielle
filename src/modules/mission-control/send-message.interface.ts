import { Message, Command } from '../../common/common.interface';

export interface ISendMessage {
  sendMessage(message: Message): Promise<boolean>;
  sendBroadcast(message: Message): Promise<boolean>;
  getMessageStatus(messageId: string): 'sent' | 'pending' | 'failed';
  retryFailedMessages(): Promise<void>;
  getFailedMessagesCount(): number;
  sendCommandToRover(command: Command): Promise<boolean>;
}