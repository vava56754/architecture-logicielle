import { IRover, Position, Orientation } from './rover.interface';

export class Rover implements IRover {
  private position: Position = { x: 0, y: 0 };
  private orientation: Orientation = 'N';
  private obstacles: Position[] = [
    { x: 1, y: 2 },
    { x: 0, y: 3 },
    { x: -1, y: 1 }
  ];

  private isObstacle(pos: Position): boolean {
    return this.obstacles.some(o => o.x === pos.x && o.y === pos.y);
  }

  getPosition(): Position {
    return { ...this.position };
  }

  getOrientation(): Orientation {
    return this.orientation;
  }

  moveForward(onError?: (msg: string) => void): boolean {
    const nextPos = { ...this.position };
    switch (this.orientation) {
      case 'N': nextPos.y += 1; break;
      case 'E': nextPos.x += 1; break;
      case 'S': nextPos.y -= 1; break;
      case 'W': nextPos.x -= 1; break;
    }
    if (this.isObstacle(nextPos)) {
      if (onError) onError('Obstacle rencontré en avançant !');
      return false;
    }
    this.position = nextPos;
    return true;
  }

  moveBackward(onError?: (msg: string) => void): boolean {
    const nextPos = { ...this.position };
    switch (this.orientation) {
      case 'N': nextPos.y -= 1; break;
      case 'E': nextPos.x -= 1; break;
      case 'S': nextPos.y += 1; break;
      case 'W': nextPos.x += 1; break;
    }
    if (this.isObstacle(nextPos)) {
      if (onError) onError('Obstacle rencontré en reculant !');
      return false;
    }
    this.position = nextPos;
    return true;
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

  public async launch(onStatusUpdate?: (msg: string) => void): Promise<void> {
    const notify = (msg: string) => {
      if (onStatusUpdate) onStatusUpdate(msg);
      console.log(msg);
    };
    notify('Décollage en cours...');
    await new Promise(res => setTimeout(res, 1000));
    notify('Arrivée sur Mars...');
    await new Promise(res => setTimeout(res, 1000));
    notify('Connexion au Rover...');
    await new Promise(res => setTimeout(res, 1000));
    notify('Le Rover a décollé et commence sa mission sur Mars !');
  }
}
