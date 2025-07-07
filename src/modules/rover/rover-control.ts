import { Position, Orientation, RoverState, RoverStatus } from './rover-types.interface';
import { Obstacles } from './obstacles';

export class Rover {
    private position: Position = { x: 0, y: 0, z: 0 };
    private orientation: Orientation = 'N';
    private battery: number = 100;
    private health: string = 'OPERATIONAL';
    private mission: string = 'EXPLORATION';
    private sensors = {
        camera: true,
        lidar: true
    };

    constructor(private obstacles: Obstacles) { }

    getPosition(): Position {
        return { ...this.position };
    }

    getOrientation(): { orientation: Orientation } {
        return { orientation: this.orientation };
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
        if (this.battery <= 0) {
            return { batteryEmpty: true };
        }

        const newPosition = { ...this.position };
        switch (this.orientation) {
            case 'N': newPosition.y += 1; break;
            case 'E': newPosition.x += 1; break;
            case 'S': newPosition.y -= 1; break;
            case 'W': newPosition.x -= 1; break;
        }

        const obstacle = this.obstacles.checkObstacleAt(newPosition);
        if (obstacle) {
            return { obstacleDetected: true };
        }

        this.position = newPosition;
        this.battery -= 5;
        return { success: true };
    }

    moveBackward(): any {
        if (this.battery <= 0) {
            return { batteryEmpty: true };
        }

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

        this.position = newPosition;
        this.battery -= 5;
        return { success: true };
    }

    turnLeft(): any {
        if (this.battery <= 0) {
            return { batteryEmpty: true };
        }

        const order: Orientation[] = ['N', 'W', 'S', 'E'];
        const idx = order.indexOf(this.orientation);
        this.orientation = order[(idx + 1) % 4];
        this.battery -= 2;
        return { success: true };
    }

    turnRight(): any {
        if (this.battery <= 0) {
            return { batteryEmpty: true };
        }

        const order: Orientation[] = ['N', 'E', 'S', 'W'];
        const idx = order.indexOf(this.orientation);
        this.orientation = order[(idx + 1) % 4];
        this.battery -= 2;
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
}
