export type Orientation = 'N' | 'E' | 'S' | 'W';

export interface Position {
    x: number;
    y: number;
    z: number;
}

export interface Obstacle {
    id: string;
    position: Position;
    size: number;
    discovered: boolean;
}

export interface RoverStatus {
    position: Position;
    orientation: { orientation: Orientation };
    battery: number;
    health: string;
    mission: string;
    sensors: {
        camera: boolean;
        lidar: boolean;
    };
}

export type CommandType = 'Z' | 'S' | 'Q' | 'D' | 'R' | 'scan' | 'return';

export interface Command {
    id: string;
    type: CommandType;
    parameters?: any;
    timestamp: Date;
}

export interface RoverState {
    position: Position;
    orientation: Orientation;
    battery: number;
    health: string;
    mission: string;
    sensors: {
        camera: boolean;
        lidar: boolean;
    };
}
