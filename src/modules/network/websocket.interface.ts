export interface IWebSocket {
  send(data: any): Promise<boolean>;
  onMessage(callback: (data: any) => void): void;
}