import { IServer } from "./server.interface";

export class WebSocketServer implements IServer {
  private wsServer: any = null;
  private onMessageCallback: ((msg: string) => void) | null = null;

  constructor() {
    const WebSocket = require('ws');
    this.wsServer = new WebSocket.Server({ port: 8080 });
  }

  startWebSocketServer() {
    const WebSocket = require('ws');
    this.wsServer = new WebSocket.Server({ port: 8080 });
    this.wsServer.on('connection', (ws: any) => {
      ws.on('message', (message: string) => {
        if (this.onMessageCallback) this.onMessageCallback(message.toString());
      });
    });
  }
  
  onMessage(cb: (msg: string) => void) {
    this.onMessageCallback = cb;
  }
  
  sendMessage(msg: string) {
    if (this.wsServer && this.wsServer.clients) {
      this.wsServer.clients.forEach((client: any) => {
        if (client.readyState === 1) client.send(msg);
      });
    }
  }
}

