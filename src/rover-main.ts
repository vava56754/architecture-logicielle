import { Rover } from './clean-archi/domain/Rover';
import { CommandInterpreter } from './clean-archi/application/CommandInterpreter';
import { startRoverWebSocketServer } from './clean-archi/infrastructure/WebSocketRoverServer';

const rover = new Rover();
const interpreter = new CommandInterpreter(rover);

startRoverWebSocketServer(8082, rover, interpreter); 