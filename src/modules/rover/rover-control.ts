import { Position, Orientation, RoverState, RoverStatus, IRover } from './types';
import { Obstacles } from './obstacles';

export class Rover implements IRover {
    private position: Position = { x: 0, y: 0, z: 0 };
    private orientation: Orientation = 'N';
    private battery: number = 100;
    private health: string = 'OPERATIONAL';
    private mission: string = 'EXPLORATION';
    private readonly WORLD_SIZE = 50; // Taille de la map toroïdale
    private sensors = {
        camera: true,
        lidar: true
    };
    public obstacles: Obstacles; // Rendre accessible publiquement

    constructor(obstacles: Obstacles) { 
        this.obstacles = obstacles;
    }

    // Normalise les coordonnées pour la map toroïdale
    private normalizePosition(pos: Position): Position {
        return {
            x: ((pos.x % this.WORLD_SIZE) + this.WORLD_SIZE) % this.WORLD_SIZE,
            y: ((pos.y % this.WORLD_SIZE) + this.WORLD_SIZE) % this.WORLD_SIZE,
            z: pos.z
        };
    }

    getPosition(): Position {
        return { ...this.position };
    }

    getOrientation(): Orientation {
        return this.orientation;
    }

    getBattery(): number {
        return this.battery;
    }

    getState(): RoverState {
        return {
            position: { ...this.position },
            orientation: this.orientation,
            battery: this.battery,
            health: this.health,
            mission: this.mission,
            sensors: { ...this.sensors }
        };
    }

    getStatus(options?: { obstacleDetected?: boolean }): RoverStatus {
        return {
            position: { ...this.position },
            orientation: { orientation: this.orientation },
            battery: this.battery,
            health: options?.obstacleDetected ? 'OBSTACLE_DETECTED' : this.health,
            mission: this.mission,
            sensors: { ...this.sensors }
        };
    }

    moveForward(): any {
        const newPosition = { ...this.position };
        switch (this.orientation) {
            case 'N': newPosition.y += 1; break;
            case 'E': newPosition.x += 1; break;
            case 'S': newPosition.y -= 1; break;
            case 'W': newPosition.x -= 1; break;
        }

        // Normaliser la nouvelle position pour l'espace toroïdal
        const normalizedPosition = this.normalizePosition(newPosition);

        const obstacle = this.obstacles.checkObstacleAt(normalizedPosition);
        if (obstacle) {
            return { obstacleDetected: true };
        }

        this.position = normalizedPosition;
        return { success: true };
    }

    moveBackward(): any {
        const newPosition = { ...this.position };
        switch (this.orientation) {
            case 'N': newPosition.y -= 1; break;
            case 'E': newPosition.x -= 1; break;
            case 'S': newPosition.y += 1; break;
            case 'W': newPosition.x += 1; break;
        }

        const obstacle = this.obstacles.checkObstacleAt(newPosition);
        if (obstacle) {
            return { obstacleDetected: true };
        }

        // Normaliser la nouvelle position pour l'espace toroïdal
        const normalizedPosition = this.normalizePosition(newPosition);
        this.position = normalizedPosition;
        return { success: true };
    }

    turnLeft(): any {
        const order: Orientation[] = ['N', 'W', 'S', 'E'];
        const idx = order.indexOf(this.orientation);
        this.orientation = order[(idx + 1) % 4];
        return { success: true };
    }

    turnRight(): any {
        const order: Orientation[] = ['N', 'E', 'S', 'W'];
        const idx = order.indexOf(this.orientation);
        this.orientation = order[(idx + 1) % 4];
        return { success: true };
    }

    async handleSolarCharging(roverReturn: any): Promise<any> {
        if (roverReturn) {
            roverReturn.handleRoverResponse('🔋 Deploying solar panels for recharge...');
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        this.battery = 100;

        if (roverReturn) {
            roverReturn.handleRoverResponse('✅ Solar charging complete. Battery at 100%');
            roverReturn.handleRoverResponse('📡 Solar panel retracted. Ready for operations.');
        }

        return { success: true, batteryLevel: this.battery };
    }

    async launch(onStatusUpdate?: (msg: string) => void): Promise<void> {
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
