import { v4 as uuidv4 } from 'uuid';
import { Obstacle, Position } from './types';

export class Obstacles {
    private obstacles: Obstacle[] = [];
    private discovered: boolean = false;
    private readonly WORLD_SIZE = 50; // Taille de la map toroïdale

    constructor() {
        // Initialize with more obstacles scattered across the toroidal map (0-49 coordinates)
        this.obstacles = [
            // Obstacles près du centre
            { id: uuidv4(), position: { x: 3, y: 2, z: 0 }, size: 1, discovered: false },
            { id: uuidv4(), position: { x: 48, y: 49, z: 0 }, size: 1, discovered: false },
            { id: uuidv4(), position: { x: 5, y: 47, z: 0 }, size: 1, discovered: false },
            { id: uuidv4(), position: { x: 46, y: 6, z: 0 }, size: 2, discovered: false },
            { id: uuidv4(), position: { x: 7, y: 1, z: 0 }, size: 1, discovered: false },
            
            // Obstacles dans les zones éloignées
            { id: uuidv4(), position: { x: 20, y: 15, z: 0 }, size: 1, discovered: false },
            { id: uuidv4(), position: { x: 30, y: 35, z: 0 }, size: 2, discovered: false },
            { id: uuidv4(), position: { x: 22, y: 32, z: 0 }, size: 1, discovered: false },
            { id: uuidv4(), position: { x: 27, y: 12, z: 0 }, size: 1, discovered: false },
            { id: uuidv4(), position: { x: 18, y: 23, z: 0 }, size: 1, discovered: false },
            
            // Obstacles près des "bords" toroïdaux
            { id: uuidv4(), position: { x: 49, y: 49, z: 0 }, size: 1, discovered: false },
            { id: uuidv4(), position: { x: 0, y: 0, z: 0 }, size: 1, discovered: false },
            { id: uuidv4(), position: { x: 49, y: 0, z: 0 }, size: 1, discovered: false },
            { id: uuidv4(), position: { x: 0, y: 49, z: 0 }, size: 1, discovered: false },
            
            // Plus d'obstacles dispersés
            { id: uuidv4(), position: { x: 10, y: 8, z: 0 }, size: 1, discovered: false },
            { id: uuidv4(), position: { x: 35, y: 3, z: 0 }, size: 1, discovered: false },
            { id: uuidv4(), position: { x: 2, y: 38, z: 0 }, size: 1, discovered: false },
            { id: uuidv4(), position: { x: 42, y: 30, z: 0 }, size: 2, discovered: false },
            { id: uuidv4(), position: { x: 16, y: 45, z: 0 }, size: 1, discovered: false },
            { id: uuidv4(), position: { x: 32, y: 19, z: 0 }, size: 1, discovered: false }
        ];
    }

    // Normalise les coordonnées pour la map toroïdale
    private normalizeCoordinate(coord: number): number {
        return ((coord % this.WORLD_SIZE) + this.WORLD_SIZE) % this.WORLD_SIZE;
    }

    private normalizePosition(position: Position): Position {
        return {
            x: this.normalizeCoordinate(position.x),
            y: this.normalizeCoordinate(position.y),
            z: position.z
        };
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

    // Découvre les obstacles dans un rayon donné autour d'une position
    discoverObstaclesInRadius(center: Position, radius: number): void {
        const normalizedCenter = this.normalizePosition(center);
        
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                if (dx * dx + dy * dy <= radius * radius) {
                    const targetX = this.normalizeCoordinate(normalizedCenter.x + dx);
                    const targetY = this.normalizeCoordinate(normalizedCenter.y + dy);
                    
                    const obstacle = this.obstacles.find(obs => 
                        this.normalizeCoordinate(obs.position.x) === targetX &&
                        this.normalizeCoordinate(obs.position.y) === targetY &&
                        obs.position.z === center.z
                    );
                    
                    if (obstacle) {
                        obstacle.discovered = true;
                    }
                }
            }
        }
    }

    checkObstacleAt(position: Position): Obstacle | null {
        const normalizedPos = this.normalizePosition(position);
        
        const obstacle = this.obstacles.find(obs => 
            this.normalizeCoordinate(obs.position.x) === normalizedPos.x &&
            this.normalizeCoordinate(obs.position.y) === normalizedPos.y &&
            obs.position.z === normalizedPos.z
        );
        
        // Découvre automatiquement l'obstacle quand on essaie de se déplacer dessus
        if (obstacle) {
            obstacle.discovered = true;
        }
        
        return obstacle || null;
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
