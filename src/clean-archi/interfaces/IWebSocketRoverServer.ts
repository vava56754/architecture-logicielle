import { IRover } from './IRover';
import { ICommandInterpreter } from './ICommandInterpreter';

export interface IWebSocketRoverServer {
  (port: number, rover: IRover, interpreter: ICommandInterpreter): void;
} 