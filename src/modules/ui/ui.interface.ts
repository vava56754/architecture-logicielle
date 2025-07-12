import { Command } from '../rover/rover.interface';

export interface IUI {
  showMessage(message: string): void;
  promptCommand(): Promise<Command>;
  updateMap(position: { x: number; y: number; }, obstacles: any[], orientation?: any): void;
} 