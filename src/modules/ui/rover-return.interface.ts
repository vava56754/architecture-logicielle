import { RoverStatus } from '../../common/common.interface';

export interface IRoverReturn {
  handleRoverResponse(response: any): void;
  updateRoverStatus(status: RoverStatus): void;
  getRoverStatus(): RoverStatus | null;
}