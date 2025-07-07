import { IRover } from '../interfaces/IRover';

export type Orientation = 'N' | 'E' | 'S' | 'W';

export interface Position {
  x: number;
  y: number;
}

export interface RoverState {
  position: Position;
  orientation: Orientation;
}

export class Rover implements IRover {
  private state: RoverState;

  constructor(initial: RoverState = { position: { x: 0, y: 0 }, orientation: 'N' }) {
    this.state = { ...initial };
  }

  getState(): RoverState {
    return { ...this.state };
  }

  moveForward(): void {
    switch (this.state.orientation) {
      case 'N': this.state.position.y += 1; break;
      case 'E': this.state.position.x += 1; break;
      case 'S': this.state.position.y -= 1; break;
      case 'W': this.state.position.x -= 1; break;
    }
  }

  moveBackward(): void {
    switch (this.state.orientation) {
      case 'N': this.state.position.y -= 1; break;
      case 'E': this.state.position.x -= 1; break;
      case 'S': this.state.position.y += 1; break;
      case 'W': this.state.position.x += 1; break;
    }
  }

  turnLeft(): void {
    const order: Orientation[] = ['N', 'W', 'S', 'E'];
    const idx = order.indexOf(this.state.orientation);
    this.state.orientation = order[(idx + 1) % 4];
  }

  turnRight(): void {
    const order: Orientation[] = ['N', 'E', 'S', 'W'];
    const idx = order.indexOf(this.state.orientation);
    this.state.orientation = order[(idx + 1) % 4];
  }
} 