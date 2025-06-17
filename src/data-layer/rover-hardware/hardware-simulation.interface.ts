export interface IHardwareSimulation {
  simulateHardwareFailure(component: string): void;
  simulateBatteryLevel(level: number): void;
  simulateSensorData(sensorType: string, data: any): void;
  simulateMotorSpeed(speed: number): void;
  simulateCommunicationDelay(ms: number): void;
  resetHardwareSimulation(): void;
  getSimulatedBatteryLevel(): number;
}
