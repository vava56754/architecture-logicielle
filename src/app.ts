import { Rover } from './modules/rover/rover';
import { MissionControl } from './modules/mission-control/mission-control';
import { WebUI } from './modules/ui/ui';

// Create the rover (domain)
const rover = new Rover();

// Create mission control (depends on rover)
const missionControl = new MissionControl(rover);

// Create UI (depends on rover)
const ui = new WebUI(rover);

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  ui.showMessage('Rover initialized and ready for commands');
});

// For debugging
(window as any).rover = rover;
(window as any).missionControl = missionControl;
(window as any).ui = ui;

console.log('Rover mission control initialized');
