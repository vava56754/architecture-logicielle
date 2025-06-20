import { IRoverControl } from './rover-control.interface';
import { Position, RoverState, Orientation } from './rover-types.interface';

export class RoverControl implements IRoverControl {
  private position: Position = { x: 0, y: 0, z: 0 };
  private orientation: Orientation = { orientation: 'N' };
  private mapSize = { width: 20, height: 20 }; // Define map boundaries for toroidal wrapping

  updatePosition(position: Position): void {
    this.position = { ...position };
    // Apply toroidal wrapping
    this.applyToroidalWrapping();
  }

  getPosition(): Position {
    return { ...this.position };
  }

  getOrientation(): Orientation {
    return { ...this.orientation };
  }

  setOrientation(orientation: Orientation): void {
    this.orientation = { ...orientation };
  }

  moveForward(): RoverState {
    const newPosition = { ...this.position };
    
    switch (this.orientation.orientation) {
      case 'N':
        newPosition.y += 1;
        break;
      case 'E':
        newPosition.x += 1;
        break;
      case 'S':
        newPosition.y -= 1;
        break;
      case 'W':
        newPosition.x -= 1;
        break;
    }
    
    this.position = newPosition;
    // Apply toroidal wrapping for seamless map edges
    this.applyToroidalWrapping();
    
    return {
      position: this.getPosition(),
      orientation: this.getOrientation(),
      obstacleDetected: false
    };
  }

  moveBackward(): RoverState {
    const newPosition = { ...this.position };
    
    switch (this.orientation.orientation) {
      case 'N':
        newPosition.y -= 1;
        break;
      case 'E':
        newPosition.x -= 1;
        break;
      case 'S':
        newPosition.y += 1;
        break;
      case 'W':
        newPosition.x += 1;
        break;
    }
    
    this.position = newPosition;
    // Apply toroidal wrapping for seamless map edges
    this.applyToroidalWrapping();
    
    return {
      position: this.getPosition(),
      orientation: this.getOrientation(),
      obstacleDetected: false
    };
  }

  turnLeft(): RoverState {
    const orientationMap: Record<string, 'N' | 'E' | 'S' | 'W'> = {
      'N': 'W',
      'W': 'S',
      'S': 'E',
      'E': 'N'
    };
    
    this.orientation.orientation = orientationMap[this.orientation.orientation];
    
    return {
      position: this.getPosition(),
      orientation: this.getOrientation(),
      obstacleDetected: false
    };
  }

  turnRight(): RoverState {
    const orientationMap: Record<string, 'N' | 'E' | 'S' | 'W'> = {
      'N': 'E',
      'E': 'S',
      'S': 'W',
      'W': 'N'
    };
    
    this.orientation.orientation = orientationMap[this.orientation.orientation];
    
    return {
      position: this.getPosition(),
      orientation: this.getOrientation(),
      obstacleDetected: false
    };
  }

  // Implement toroidal wrapping (map loops around at edges)
  private applyToroidalWrapping(): void {
    // Horizontal wrapping (x-axis)
    if (this.position.x < -Math.floor(this.mapSize.width / 2)) {
      this.position.x = Math.floor(this.mapSize.width / 2) - 1;
    } else if (this.position.x >= Math.floor(this.mapSize.width / 2)) {
      this.position.x = -Math.floor(this.mapSize.width / 2);
    }
    
    // Vertical wrapping (y-axis)
    if (this.position.y < -Math.floor(this.mapSize.height / 2)) {
      this.position.y = Math.floor(this.mapSize.height / 2) - 1;
    } else if (this.position.y >= Math.floor(this.mapSize.height / 2)) {
      this.position.y = -Math.floor(this.mapSize.height / 2);
    }
  }
}
