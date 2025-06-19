import { Message, Command } from '../rover/rover-types.interface';

export interface IMessaging {
  sendCommandToRover(command: Command): Promise<boolean>;
  receiveCommand(): Promise<Command>;
}