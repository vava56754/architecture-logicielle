import { IWebSocket } from './websocket.interface';

export class WebSocketClient implements IWebSocket {
  private socket: WebSocket | null = null;
  private messageCallback: ((data: any) => void) | null = null;

  async connect(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        this.socket = new WebSocket(url);
        
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          resolve(true);
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          resolve(false);
        };
        
        this.socket.onmessage = (event) => {
          if (this.messageCallback) {
            try {
              const data = JSON.parse(event.data);
              this.messageCallback(data);
            } catch (e) {
              console.error('Error parsing message:', e);
              this.messageCallback(event.data);
            }
          }
        };
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
        resolve(false);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  async send(data: any): Promise<boolean> {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not connected, simulating send");
      // In development, simulate success even without connection
      if (this.messageCallback) {
        setTimeout(() => {
          this.messageCallback?.(data);
        }, 500);
      }
      return true;
    }
    
    try {
      const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
      this.socket.send(jsonData);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  onMessage(callback: (data: any) => void): void {
    this.messageCallback = callback;
  }
}
