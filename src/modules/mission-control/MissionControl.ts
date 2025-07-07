import { Rover } from '../rover/rover-control';
import { Obstacles } from '../rover/obstacles';
import { Command } from '../rover/rover-types.interface';
import { Messaging } from './Messaging';

export class MissionControl {
    constructor(
        private rover: Rover,
        private obstacles: Obstacles,
        private messaging: Messaging
    ) { }

    async executeCommand(command: Command): Promise<any> {
        console.log(`Processing command: ${command.type}`);
        let result: any = null;

        try {
            switch (command.type) {
                case 'Z':
                    result = this.rover.moveForward();
                    break;
                case 'S':
                    result = this.rover.moveBackward();
                    break;
                case 'Q':
                    result = this.rover.turnLeft();
                    break;
                case 'D':
                    result = this.rover.turnRight();
                    break;
                case 'R':
                    result = await this.rover.handleSolarCharging(null);
                    break;
                case 'scan':
                    this.obstacles.discoverAllObstacles();
                    result = {
                        obstacles: this.obstacles.scanObstacles(),
                        message: 'Scan complete. Obstacles detected and mapped.'
                    };
                    break;
                case 'return':
                    result = { message: 'Return command received. Planning route back to base.' };
                    break;
                default:
                    console.warn(`Unknown command type: ${command.type}`);
                    return null;
            }

            // Send command to rover via messaging
            await this.messaging.sendCommandToRover(command);
            return result;
        } catch (error) {
            console.error(`Error executing command ${command.type}:`, error);
            return null;
        }
    }

    async executeCommandSequence(commands: Command[]): Promise<{
        completedCommands: number;
        batteryEmpty: boolean;
        obstacleEncountered: boolean;
    }> {
        let obstacleEncountered = false;
        let batteryEmpty = false;
        let completedCommands = 0;

        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            const result = await this.executeCommand(command);

            if (result && result.batteryEmpty) {
                batteryEmpty = true;
                break;
            }

            if (result && result.obstacleDetected) {
                obstacleEncountered = true;
                break;
            }

            completedCommands++;

            if (i < commands.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }

        return {
            completedCommands,
            batteryEmpty,
            obstacleEncountered
        };
    }

    getRoverStatus(): any {
        return this.rover.getStatus();
    }

    getRoverPosition(): any {
        return this.rover.getPosition();
    }

    getRoverOrientation(): any {
        return this.rover.getOrientation();
    }

    getDiscoveredObstacles(): any {
        return this.obstacles.scanObstacles();
    }
}
