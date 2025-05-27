export interface Position {
  x: number;
  y: number;
  z?: number; // Optionnel pour la compatibilité 2D/3D
}

export interface Obstacle {
  position: Position;
  type: 'rock' | 'crater' | 'debris';
  size: number;
  discovered?: boolean;
}

export interface Command {
  id: string;
  type: 'Z' | 'S' | 'Q' | 'D' | 'scan' | 'return';
  parameters?: any;
  timestamp: Date;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  content: any;
  timestamp: Date;
  type: 'command' | 'status' | 'data' | 'error';
}

export interface RoverStatus {
  position: Position;
  orientation: 'N' | 'E' | 'S' | 'W';
  battery: number;
  health: 'healthy' | 'warning' | 'critical';
  mission: string;
  obstacleDetected?: boolean;
}

export interface RoverState {
  position: Position;
  orientation: 'N' | 'E' | 'S' | 'W';
  obstacleDetected: boolean;
  lastCommand?: Command;
}
