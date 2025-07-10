import { IUI } from './modules/ui/ui.interface';
import { Rover } from './modules/rover/rover-control';
import { Obstacles } from './modules/rover/obstacles';
import { IRover } from './modules/rover/types';

const obstacles = new Obstacles();
const rover: IRover = new Rover(obstacles);
const { WebUI } = require('./modules/ui/ui');
const ui: IUI = new WebUI(rover);

if (rover.launch) rover.launch((msg: string) => ui.showMessage(msg));
document.addEventListener('DOMContentLoaded', () => {
  ui.showMessage('Rover initialized and ready for commands');
});

console.log('Rover mission control (Browser) initialized');
