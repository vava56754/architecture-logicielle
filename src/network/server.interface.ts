export interface IServer {
    startWebSocketServer(): void;
  onMessage(callback: (message: string) => void): void;
  sendMessage(message: string): void;
}