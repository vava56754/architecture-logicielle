import { RoverStatus } from '../../interfaces/common.interface';

export interface IDisplayAllUserInput {
  displayAllInputs(): void;
  displayRoverStatus(status: RoverStatus): void;
}
