export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Obstacle {
  position: Position;
  type: string;
  size: number;
}

export interface Command {
  id: string;
  type: 'move' | 'stop' | 'scan' | 'return';
  parameters?: any;
  timestamp: Date;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  content: any;
  timestamp: Date;
}

export interface RoverStatus {
  position: Position;
  battery: number;
  health: string;
  mission: string;
}
