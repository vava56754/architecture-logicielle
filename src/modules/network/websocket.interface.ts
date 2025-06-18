export interface IWebSocket {
  connect(url: string): Promise<boolean>;
  disconnect(): void;
  send(data: any): Promise<boolean>;
  onMessage(callback: (data: any) => void): void;
  onConnect(callback: () => void): void;
  onDisconnect(callback: () => void): void;
  isConnected(): boolean;
}