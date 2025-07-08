import { Rover } from './modules/rover/rover';
import { MissionControl } from './modules/mission-control/mission-control';
import { WebUI } from './modules/ui/ui';

const rover = new Rover();

const missionControl = new MissionControl(rover);

const ui = new WebUI(rover);

document.addEventListener('DOMContentLoaded', () => {
  ui.showMessage('Rover initialized and ready for commands');
});

(window as any).rover = rover;
(window as any).missionControl = missionControl;
(window as any).ui = ui;

console.log('Rover mission control initialized');
