import { IRover, Position, Orientation } from './rover.interface';

export class Rover implements IRover {
  private position: Position = { x: 0, y: 0 };
  private orientation: Orientation = 'N';

  getPosition(): Position {
    return { ...this.position };
  }

  getOrientation(): Orientation {
    return this.orientation;
  }

  moveForward(): void {
    switch (this.orientation) {
      case 'N': this.position.y += 1; break;
      case 'E': this.position.x += 1; break;
      case 'S': this.position.y -= 1; break;
      case 'W': this.position.x -= 1; break;
    }
  }

  moveBackward(): void {
    switch (this.orientation) {
      case 'N': this.position.y -= 1; break;
      case 'E': this.position.x -= 1; break;
      case 'S': this.position.y += 1; break;
      case 'W': this.position.x += 1; break;
    }
  }

  turnLeft(): void {
    const order: Orientation[] = ['N', 'W', 'S', 'E'];
    const idx = order.indexOf(this.orientation);
    this.orientation = order[(idx + 1) % 4];
  }

  turnRight(): void {
    const order: Orientation[] = ['N', 'E', 'S', 'W'];
    const idx = order.indexOf(this.orientation);
    this.orientation = order[(idx + 1) % 4];
  }
}
