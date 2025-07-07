import { IRover } from '../interfaces/IRover';
import { ICommandInterpreter } from '../interfaces/ICommandInterpreter';
import { IWebSocketRoverServer } from '../interfaces/IWebSocketRoverServer';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

export const startRoverWebSocketServer: IWebSocketRoverServer = (port, rover, interpreter) => {
  const server = createServer();
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const commandStr = message.toString();
      interpreter.execute(commandStr);
      ws.send(JSON.stringify({ state: rover.getState() }));
    });
    ws.send('Rover WebSocket server ready');
  });

  server.listen(port, () => {
    console.log(`Rover WebSocket server listening on ws://localhost:${port}`);
  });
}; 