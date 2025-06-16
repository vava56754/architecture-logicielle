export interface IManageLostConnection {
  checkConnection(): boolean;
  handleConnectionLoss(): void;
  reconnect(): Promise<boolean>;
  setReconnectInterval(interval: number): void;
  getConnectionAttempts(): number;
  isReconnecting(): boolean;
  onConnectionRestored(callback: () => void): void;
  simulateConnectionLoss(): void;
}
