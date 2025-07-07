import { IWebSocketMissionClient } from '../interfaces/IWebSocketMissionClient';
import WebSocket from 'ws';

export class WebSocketMissionClient implements IWebSocketMissionClient {
  private ws: WebSocket;

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.ws.on('open', () => {
      console.log('Connected to Rover WebSocket server');
    });
    this.ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.state) {
          console.log('Rover state:', msg.state);
        } else {
          console.log('Message:', msg);
        }
      } catch {
        console.log('Message:', data.toString());
      }
    });
  }

  sendCommand(command: string) {
    this.ws.send(command);
  }
} 