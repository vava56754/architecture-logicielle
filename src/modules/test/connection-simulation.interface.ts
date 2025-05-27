export interface IConnectionSimulation {
  simulateConnection(isConnected: boolean): void;
  simulateLatency(ms: number): void;
  simulatePacketLoss(percentage: number): void;
  simulateBandwidth(kbps: number): void;
  resetSimulation(): void;
  getSimulationState(): any;
}
