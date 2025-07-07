import { Position, Obstacle } from './rover-types.interface';
import { v4 as uuidv4 } from 'uuid';

export class Obstacles {
    private obstacles: Obstacle[] = [];
    private discovered: boolean = false;

    constructor() {
        // Initialize with some predefined obstacles
        this.obstacles = [
            {
                id: uuidv4(),
                position: { x: 3, y: 2, z: 0 },
                size: 1,
                discovered: false
            },
            {
                id: uuidv4(),
                position: { x: -1, y: 4, z: 0 },
                size: 2,
                discovered: false
            },
            {
                id: uuidv4(),
                position: { x: 5, y: -3, z: 0 },
                size: 1,
                discovered: false
            },
            {
                id: uuidv4(),
                position: { x: -2, y: -1, z: 0 },
                size: 1,
                discovered: false
            }
        ];
    }

    scanObstacles(): Obstacle[] {
        return this.obstacles.filter(obstacle => obstacle.discovered);
    }

    discoverAllObstacles(): void {
        this.obstacles.forEach(obstacle => {
            obstacle.discovered = true;
        });
        this.discovered = true;
    }

    checkObstacleAt(position: Position): Obstacle | null {
        return this.obstacles.find(obstacle =>
            obstacle.position.x === position.x &&
            obstacle.position.y === position.y &&
            obstacle.position.z === position.z
        ) || null;
    }

    addObstacle(position: Position, size: number = 1): void {
        this.obstacles.push({
            id: uuidv4(),
            position,
            size,
            discovered: false
        });
    }

    getAllObstacles(): Obstacle[] {
        return [...this.obstacles];
    }
}
