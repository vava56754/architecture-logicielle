import { IRover } from './modules/rover/rover.interface';
import { IMissionControle } from './modules/mission-control/mission-control.interface';
import { IUI } from './modules/ui/ui.interface';
import { Rover } from './modules/rover/rover';
import { MissionControl } from './modules/mission-control/mission-control';

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
  const { startWebSocketServer } = require('./network/server');
  startWebSocketServer(missionControl);
}

console.log('Rover mission control initialized');
