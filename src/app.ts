import { Rover } from './modules/rover/rover';
import { MissionControl } from './modules/mission-control/mission-control';

const rover = new Rover();
const missionControl = new MissionControl(rover);

if (typeof window !== 'undefined') {
  const { WebUI } = require('./modules/ui/ui');
  const ui = new WebUI(rover);
  rover.launch((msg: string) => ui.showMessage(msg));
  document.addEventListener('DOMContentLoaded', () => {
    ui.showMessage('Rover initialized and ready for commands');
  });
} else {
  const { startWebSocketServer } = require('./network/server');
  startWebSocketServer(missionControl);
}

console.log('Rover mission control initialized');
