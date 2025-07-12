import { Command } from "../rover/rover.interface";

export interface IMissionControle {
  sendCommandToRover(command: Command): Promise<boolean>;
  receiveCommand(): Promise<Command>;
}