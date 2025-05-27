import { RoverStatus } from '../../interfaces/common.interface';

export interface IRoverReturn {
  handleRoverResponse(response: any): void;
  updateRoverStatus(status: RoverStatus): void;
  getRoverStatus(): RoverStatus | null;
  isRoverConnected(): boolean;
  getLastResponseTime(): Date | null;
  setResponseTimeout(timeout: number): void;
}
