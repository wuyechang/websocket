const server = require('http').createServer();
const io = require('socket.io')(server);
io.on('connection', client => {
  console.log('connected!');
  client.emit('news', { hello: 'world' });
  client.on('hello', data => {
    console.log(data);
  });
  client.on('notice', data => {
    console.log('notice comes');
    client.broadcast.emit('attention', data);
  });
  client.on('disconnect', () => {
    console.log('disconnected!');
  });
});
server.listen(3000);