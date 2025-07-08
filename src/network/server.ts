let wsServer: any = null;
let onMessageCallback: ((msg: string) => void) | null = null;

export function startWebSocketServer() {
  const WebSocket = require('ws');
  wsServer = new WebSocket.Server({ port: 8080 });
  wsServer.on('connection', (ws: any) => {
    ws.on('message', (message: string) => {
      if (onMessageCallback) onMessageCallback(message.toString());
    });
  });
}

export function onMessage(cb: (msg: string) => void) {
  onMessageCallback = cb;
}

export function sendMessage(msg: string) {
  if (wsServer && wsServer.clients) {
    wsServer.clients.forEach((client: any) => {
      if (client.readyState === 1) client.send(msg);
    });
  }
}