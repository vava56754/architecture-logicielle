import { IWebSocket } from './websocket.interface';

export class WebSocketClient implements IWebSocket {
  private socket: WebSocket | null = null;
  private messageCallback: ((data: any) => void) | null = null;
  private isConnected: boolean = false;

  async connect(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        console.log(`Attempting to connect to WebSocket: ${url}`);
        this.socket = new WebSocket(url);
        
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          this.isConnected = true;
          resolve(true);
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnected = false;
          resolve(false);
        };
        
        this.socket.onclose = () => {
          console.log('WebSocket connection closed');
          this.isConnected = false;
        };
        
        this.socket.onmessage = (event) => {
          if (this.messageCallback) {
            try {
              const data = JSON.parse(event.data);
              console.log('Received WebSocket message:', data);
              this.messageCallback(data);
            } catch (e) {
              console.error('Error parsing message:', e);
              this.messageCallback(event.data);
            }
          }
        };

        // Set timeout for connection
        setTimeout(() => {
          if (!this.isConnected) {
            console.log('WebSocket connection timeout');
            resolve(false);
          }
        }, 5000);

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
      this.isConnected = false;
    }
  }

  async send(data: any): Promise<boolean> {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not connected, cannot send data");
      return false;
    }
    
    try {
      const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
      console.log('Sending WebSocket message:', jsonData);
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

  isConnectedToServer(): boolean {
    return this.isConnected && this.socket?.readyState === WebSocket.OPEN;
  }

  /**
   * Connecte au WebSocket et notifie le RoverReturn du status
   */
  async connectToRover(url: string, roverReturn: any, roverControl: any): Promise<boolean> {
    if (!roverReturn) return false;
    roverReturn.handleRoverResponse('Attempting to connect to rover...');
    const connected = await this.connect(url);
    if (connected) {
      roverReturn.handleRoverResponse('✅ Connected to rover WebSocket server');
      // Envoi du status initial
      const initialStatus = roverControl.getStatus();
      roverReturn.updateRoverStatus(initialStatus);
    } else {
      roverReturn.handleRoverResponse({
        error: true,
        message: '❌ Failed to connect to rover. Make sure WebSocket server is running on port 8081.'
      });
    }
    return connected;
  }
}
