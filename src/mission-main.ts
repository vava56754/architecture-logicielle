import { WebSocketMissionClient } from './clean-archi/infrastructure/WebSocketMissionClient';
import readline from 'readline';

const client = new WebSocketMissionClient('ws://localhost:8082');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Entrez une séquence de commandes (A R G D), puis appuyez sur Entrée :');
rl.on('line', (input) => {
  client.sendCommand(input.trim());
}); 