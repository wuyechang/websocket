const server = require('http').createServer();
const io = require('socket.io')(server);

const connMap = new Map();

io.on('connection', client => {
  console.log('connected!');

  connMap.set(client, 'default');

  client.emit('news', { hello: 'world' });

  client.on('hello', data => {
    console.log(data);
  });

  client.on('channel', channelName => {
    console.log('change to ', channelName);
    connMap.set(client, channelName);
    client.emit('message', {
      name: 'SYSTEM',
      message: `Welcome to ${channelName}`,
    });
  });

  client.on('notice', data => {
    console.log('notice comes');
    client.broadcast.emit('attention', data);
  });

  client.on('message', data => {
    console.log('message comes');
    const channel = connMap.get(client);
    for (const [key, value] of connMap) {
      if (value === channel && key !== client) {
        key.emit('message', data);
      }
    }
  });

  client.on('disconnect', () => {
    console.log('disconnected!');
  });
});

server.listen(3000);