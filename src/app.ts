import { IRover } from './modules/rover/rover.interface';
import { IMissionControle } from './modules/mission-control/mission-control.interface';
import { IUI } from './modules/ui/ui.interface';
import { Rover } from './modules/rover/rover';
import { MissionControl } from './modules/mission-control/mission-control';
import { startWebSocketServer, onMessage, sendMessage } from './network/server';

const rover: IRover = new Rover();
const missionControl: IMissionControle = new MissionControl(rover);

if (typeof window !== 'undefined') {
  const { WebUI } = require('./modules/ui/ui');
  const ui: IUI = new WebUI(rover);
  if (rover.launch) rover.launch((msg: string) => ui.showMessage(msg));
  document.addEventListener('DOMContentLoaded', () => {
    ui.showMessage('Rover initialized and ready for commands');
  });
} else {
  startWebSocketServer();
  onMessage(async (message: string) => {
    const commandStr = message.toUpperCase();
    for (const char of commandStr) {
      if (['Z', 'S', 'Q', 'D'].includes(char)) {
        const command = { id: Date.now().toString(), type: char as 'Z' | 'S' | 'Q' | 'D', timestamp: new Date() };
        const result = await missionControl.sendCommandToRover(command);
        if (result === false) {
          sendMessage('Arrêt de la séquence : obstacle rencontré.');
          break;
        }
        sendMessage('Commande exécutée : ' + char);
      } else {
        sendMessage('Commande inconnue reçue : ' + char);
      }
    }
  });
}

console.log('Rover mission control initialized');
