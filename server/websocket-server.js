const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

console.log('WebSocket server started on port 8081');

wss.on('connection', function connection(ws) {
  console.log('New client connected');

  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);
      console.log('Received command:', data);

      // Echo the command back to simulate rover response
      setTimeout(() => {
        const response = {
          id: data.id,
          type: 'response',
          originalCommand: data.type,
          timestamp: new Date().toISOString(),
          status: 'executed'
        };
        
        ws.send(JSON.stringify(response));
      }, 100);

    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', function close() {
    console.log('Client disconnected');
  });

  ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to rover WebSocket server',
    timestamp: new Date().toISOString()
  }));
});
