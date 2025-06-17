export interface IConnection {
  connect(): Promise<boolean>;
  disconnect(): void;
  isConnected(): boolean;
  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' | 'error';
  getLastConnectedTime(): Date | null;
  sendDataToRover(data: any): Promise<boolean>;
  receiveDataFromRover(): Promise<any>;
}
