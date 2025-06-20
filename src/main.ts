import { ConsoleInput } from './modules/ui/ConsoleInput';
import { ConsoleMap } from './modules/ui/ConsoleMap';
import { ConsoleRoverReturn } from './modules/ui/ConsoleRoverReturn';
import { WebSocketClient } from './modules/network/WebSocketClient';
import { Messaging } from './modules/mission-control/Messaging';
import { RoverControl } from './modules/rover/RoverControl';
import { Command } from './modules/rover/rover-types.interface';

async function main() {
  const input = new ConsoleInput();
  const map = new ConsoleMap();
  const roverReturn = new ConsoleRoverReturn();
  const ws = new WebSocketClient();
  const messaging = new Messaging(ws);
  const rover = new RoverControl();

  await ws.connect('ws://localhost:1234');

  while (true) {
    const command: Command = await input.captureUserInput();
    await messaging.sendCommandToRover(command);

    // Simule la réception côté rover
    ws.onMessage(async (cmd: Command) => {
      let state: import('./modules/rover/rover-types.interface').RoverState;
      switch (cmd.type) {
        case 'Z': state = rover.moveForward(); break;
        case 'S': state = rover.moveBackward(); break;
        case 'Q': state = rover.turnLeft(); break;
        case 'D': state = rover.turnRight(); break;
        default: state = {
          position: rover.getPosition(),
          orientation: rover.getOrientation(),
          obstacleDetected: false,
        }; break;
      }
      roverReturn.updateRoverStatus({
        position: state.position,
        orientation: state.orientation,
        battery: 100,
        health: 'healthy',
        mission: 'exploration',
        lastUpdate: new Date(),
        speed: 1,
        sensors: { camera: true, lidar: true, thermometer: true },
      });
      map.updateMap(state.position, [], state.orientation);
      map.displayMap();
    });
  }
}

main(); 