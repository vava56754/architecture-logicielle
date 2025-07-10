import { IRover } from './modules/rover/rover.interface';
import { IMissionControle } from './modules/mission-control/mission-control.interface';
import { Rover } from './modules/rover/rover';
import { MissionControl } from './modules/mission-control/mission-control';
import { WebSocketServer } from './network/server';

const rover: IRover = new Rover();
const missionControl: IMissionControle = new MissionControl(rover);

const wsServer = new WebSocketServer();
wsServer.onMessage(async (message: string) => {
  const commandStr = message.toUpperCase();
  for (const char of commandStr) {
    if (['Z', 'S', 'Q', 'D'].includes(char)) {
      const command = { id: Date.now().toString(), type: char as 'Z' | 'S' | 'Q' | 'D', timestamp: new Date() };
      const result = await missionControl.sendCommandToRover(command);
      if (result === false) {
        wsServer.sendMessage('Arrêt de la séquence : obstacle rencontré.');
        break;
      }
      wsServer.sendMessage('Commande exécutée : ' + char);
    } else {
      wsServer.sendMessage('Commande inconnue reçue : ' + char);
    }
  }
});

console.log('Rover mission control (Node) initialized');
