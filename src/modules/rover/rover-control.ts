import { IRoverControl } from './rover-control.interface';
import { Position, RoverState, Orientation } from './rover-types.interface';
import { IObstacles } from './obstacles.interface';

export class RoverControl implements IRoverControl {
  private position: Position = { x: 0, y: 0, z: 0 };
  private orientation: Orientation = { orientation: 'N' };
  private mapSize = { width: 20, height: 20 };
  private obstaclesService: IObstacles | null = null;
  private battery: number = 100; // Add battery level

  constructor(obstaclesService?: IObstacles) {
    if (obstaclesService) {
      this.obstaclesService = obstaclesService;
    }
  }

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

  getBattery(): number {
    return this.battery;
  }

  setBattery(level: number): void {
    this.battery = Math.max(0, Math.min(100, level));
  }

  chargeBattery(): void {
    this.battery = 100;
  }

  private consumeBattery(amount: number): boolean {
    if (this.battery <= 0) {
      return false; // Cannot move, battery is empty
    }
    this.battery = Math.max(0, this.battery - amount);
    return true;
  }

  moveForward(): RoverState {
    // Check battery first
    if (!this.consumeBattery(2)) {
      return {
        position: this.getPosition(),
        orientation: this.getOrientation(),
        obstacleDetected: false,
        batteryEmpty: true
      };
    }

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
    
    // Check for obstacles before moving
    if (this.obstaclesService && !this.obstaclesService.isPathClear(newPosition)) {
      // Obstacle detected - restore battery since we didn't actually move
      this.battery = Math.min(100, this.battery + 2);
      return {
        position: this.getPosition(),
        orientation: this.getOrientation(),
        obstacleDetected: true,
        lastCommand: {
          id: 'forward-blocked',
          type: 'Z',
          timestamp: new Date()
        }
      };
    }
    
    // No obstacle, proceed with movement
    this.position = newPosition;
    this.applyToroidalWrapping();
    
    return {
      position: this.getPosition(),
      orientation: this.getOrientation(),
      obstacleDetected: false
    };
  }

  moveBackward(): RoverState {
    // Check battery first
    if (!this.consumeBattery(2)) {
      return {
        position: this.getPosition(),
        orientation: this.getOrientation(),
        obstacleDetected: false,
        batteryEmpty: true
      };
    }

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
    
    // Check for obstacles before moving
    if (this.obstaclesService && !this.obstaclesService.isPathClear(newPosition)) {
      // Obstacle detected - restore battery since we didn't actually move
      this.battery = Math.min(100, this.battery + 2);
      return {
        position: this.getPosition(),
        orientation: this.getOrientation(),
        obstacleDetected: true,
        lastCommand: {
          id: 'backward-blocked',
          type: 'S',
          timestamp: new Date()
        }
      };
    }
    
    // No obstacle, proceed with movement
    this.position = newPosition;
    this.applyToroidalWrapping();
    
    return {
      position: this.getPosition(),
      orientation: this.getOrientation(),
      obstacleDetected: false
    };
  }

  turnLeft(): RoverState {
    // Turning consumes less battery
    if (!this.consumeBattery(1)) {
      return {
        position: this.getPosition(),
        orientation: this.getOrientation(),
        obstacleDetected: false,
        batteryEmpty: true
      };
    }

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
    // Turning consumes less battery
    if (!this.consumeBattery(1)) {
      return {
        position: this.getPosition(),
        orientation: this.getOrientation(),
        obstacleDetected: false,
        batteryEmpty: true
      };
    }

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

  // Helper method to check if there's an obstacle at the current position
  public hasObstacleAtCurrentPosition(): boolean {
    return this.obstaclesService ? 
      !this.obstaclesService.isPathClear(this.position) : 
      false;
  }

  // Helper method to detect obstacles in the vicinity
  public detectNearbyObstacles(radius: number = 1): any[] {
    return this.obstaclesService ? 
      this.obstaclesService.detectNearbyObstacles(radius) : 
      [];
  }
}
