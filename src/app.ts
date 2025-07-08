import { Rover } from './modules/rover/rover';
import { MissionControl } from './modules/mission-control/mission-control';

const rover = new Rover();
const missionControl = new MissionControl(rover);

let ui: any = null;

if (typeof window !== 'undefined') {
  const { WebUI } = require('./modules/ui/ui');
  ui = new WebUI(rover);
  rover.launch((msg: string) => ui.showMessage(msg));
  document.addEventListener('DOMContentLoaded', () => {
    ui.showMessage('Rover initialized and ready for commands');
  });
  (window as any).rover = rover;
  (window as any).missionControl = missionControl;
  (window as any).ui = ui;
} else {
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

console.log('Rover mission control initialized');
