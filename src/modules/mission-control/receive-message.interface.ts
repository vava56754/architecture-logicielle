import { Command } from '../../common/common.interface';

export interface IReceiveMessage {
  receiveCommand(): Promise<Command>;
}
