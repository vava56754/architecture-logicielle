import { Command } from "../rover/types";
 
export interface IUI {
  showMessage(message: string): void;
  promptCommand(): Promise<Command>;
  updateMap(position: { x: number; y: number; }, obstacles: any[], orientation?: any): void;
} 