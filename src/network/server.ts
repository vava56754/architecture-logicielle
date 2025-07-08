import { MissionControl } from '../modules/mission-control/mission-control';

export function startWebSocketServer(missionControl: MissionControl) {
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ port: 8080 });
  console.log('WebSocket server started on ws://localhost:8080');
  wss.on('connection', (ws: any) => {
    ws.on('message', async (message: string) => {
      const commandStr = message.toString().toUpperCase();
      for (const char of commandStr) {
        if (['Z', 'S', 'Q', 'D'].includes(char)) {
          const command = { id: Date.now().toString(), type: char as 'Z' | 'S' | 'Q' | 'D', timestamp: new Date() };
          const result = await missionControl.sendCommandToRover(command);
          if (result === false) {
            ws.send('Arrêt de la séquence : obstacle rencontré.');
            break;
          }
          ws.send('Commande exécutée : ' + char);
        } else {
          ws.send('Commande inconnue reçue : ' + char);
        }
      }
    });
  });
} 