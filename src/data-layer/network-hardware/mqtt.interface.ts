export interface IMQTT {
  connect(broker: string, options?: any): Promise<boolean>;
  disconnect(): void;
  publish(topic: string, message: any, options?: any): Promise<boolean>;
  subscribe(topic: string, callback: (message: any) => void): void;
  unsubscribe(topic: string): void;
  isConnected(): boolean;
  getClientId(): string;
}
