import { IObstacles } from './obstacles.interface';
import { Position, Obstacle } from './rover-types.interface';

export class Obstacles implements IObstacles {
  private obstacles: Obstacle[] = [
    {
      position: { x: 3, y: 4, z: 0 },
      size: 2,
      discovered: false
    },
    {
      position: { x: -2, y: 5, z: 0 },
      size: 3,
      discovered: false
    },
    {
      position: { x: 7, y: -1, z: 0 },
      size: 1,
      discovered: false
    },
    {
      position: { x: 1, y: 2, z: 0 },
      size: 1,
      discovered: false
    },
    {
      position: { x: -1, y: -1, z: 0 },
      size: 2,
      discovered: false
    }
  ];

  isPathClear(target: Position): boolean {
    // Check if any obstacle is at the target position
    return !this.obstacles.some(obstacle => 
      obstacle.position.x === target.x && 
      obstacle.position.y === target.y && 
      obstacle.position.z === target.z
    );
  }

  scanObstacles(): Obstacle[] {
    // Mark all obstacles as discovered when scanning
    this.obstacles.forEach(obstacle => {
      obstacle.discovered = true;
    });
    return [...this.obstacles];
  }

  detectNearbyObstacles(radius: number): Obstacle[] {
    const roverPosition = { x: 0, y: 0, z: 0 };
    
    return this.obstacles.filter(obstacle => {
      const distance = Math.sqrt(
        Math.pow(obstacle.position.x - roverPosition.x, 2) +
        Math.pow(obstacle.position.y - roverPosition.y, 2) +
        Math.pow(obstacle.position.z - roverPosition.z, 2)
      );
      
      if (distance <= radius) {
        obstacle.discovered = true;
        return true;
      }
      return false;
    });
  }

  getObstacleAt(position: Position): Obstacle | null {
    const obstacle = this.obstacles.find(o => 
      o.position.x === position.x && 
      o.position.y === position.y && 
      o.position.z === position.z
    );
    
    if (!obstacle) return null;
    
    if (!obstacle.discovered) {
      return {
        position: { ...obstacle.position },
        size: 0,
        discovered: false
      };
    }
    
    return { ...obstacle };
  }

  hasDiscoveredObstacle(x: number, y: number): boolean {
    const obstacle = this.obstacles.find(o => 
      o.position.x === x && 
      o.position.y === y && 
      o.discovered === true
    );
    
    return !!obstacle;
  }
}
