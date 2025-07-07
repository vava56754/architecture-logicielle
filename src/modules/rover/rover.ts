import { IRover, Position, Orientation, RoverState } from './rover.interface';

export class Rover implements IRover {
  private state: RoverState;

  constructor(initial: RoverState = { position: { x: 0, y: 0 }, orientation: 'N' }) {
    this.state = { ...initial };
  }

  getState(): RoverState {
    return { ...this.state };
  }

  getPosition(): Position {
    return { ...this.state.position };
  }

  getOrientation(): Orientation {
    return this.state.orientation;
  }

  moveForward(): RoverState {
    switch (this.state.orientation) {
      case 'N': this.state.position.y += 1; break;
      case 'E': this.state.position.x += 1; break;
      case 'S': this.state.position.y -= 1; break;
      case 'W': this.state.position.x -= 1; break;
    }
    return this.getState();
  }

  moveBackward(): RoverState {
    switch (this.state.orientation) {
      case 'N': this.state.position.y -= 1; break;
      case 'E': this.state.position.x -= 1; break;
      case 'S': this.state.position.y += 1; break;
      case 'W': this.state.position.x += 1; break;
    }
    return this.getState();
  }

  turnLeft(): RoverState {
    const order: Orientation[] = ['N', 'W', 'S', 'E'];
    const idx = order.indexOf(this.state.orientation);
    this.state.orientation = order[(idx + 1) % 4];
    return this.getState();
  }

  turnRight(): RoverState {
    const order: Orientation[] = ['N', 'E', 'S', 'W'];
    const idx = order.indexOf(this.state.orientation);
    this.state.orientation = order[(idx + 1) % 4];
    return this.getState();
  }
}
