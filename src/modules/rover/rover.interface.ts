export type Orientation = 'N' | 'E' | 'S' | 'W';

export interface Position {
  x: number;
  y: number;
}

export interface IRover {
  getPosition(): Position;
  getOrientation(): Orientation;
  moveForward(): void;
  moveBackward(): void;
  turnLeft(): void;
  turnRight(): void;
  launch?(onStatusUpdate?: (msg: string) => void): Promise<void>;
}

export type Command = {
  id: string;
  type: 'Z' | 'S' | 'Q' | 'D';
  parameters?: any;
  timestamp: Date;
}; 