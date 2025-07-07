import { RoverStatus } from '../rover/rover-types.interface';

export interface IRoverReturn {
  handleRoverResponse(response: any): void;
  updateRoverStatus(status: RoverStatus): void;
  getRoverStatus(): RoverStatus | null;
  isRoverConnected(): boolean;
  getLastResponseTime(): Date | null;
}