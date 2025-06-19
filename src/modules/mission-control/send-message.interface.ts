import { Message, Command } from '../../common/common.interface';

export interface ISendMessage {
  sendCommandToRover(command: Command): Promise<boolean>;
}